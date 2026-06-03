import { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { FLOWS, FlowKey } from '@/data/quizzes';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getResult } from '@/lib/store';
import { colors, radius, spacing } from '@/constants/colors';

export default function ResultsScreen() {
  const { flow } = useLocalSearchParams<{ flow: FlowKey }>();
  const meta = FLOWS[flow as FlowKey];
  const data = getResult(flow as FlowKey);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/')} hitSlop={12}>
          <Ionicons name="home-outline" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{meta?.title ?? 'Results'}</Text>
        <Pressable onPress={() => router.push('/assistant')} hitSlop={12}>
          <Ionicons name="sparkles-outline" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!data ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No results to show. Take the quiz to get recommendations.</Text>
            <Button title="Start a quiz" onPress={() => router.replace('/')} />
          </View>
        ) : flow === 'student' ? (
          <StudentResults data={data} />
        ) : (
          <GenericResults data={data} />
        )}

        {data ? (
          <Button
            title="Ask the AI Coach about this"
            variant="outline"
            onPress={() => router.push('/assistant')}
            style={{ marginTop: spacing.lg }}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function StudentResults({ data }: { data: any }) {
  const majors: any[] = data.majors ?? [];
  return (
    <>
      <Text style={styles.intro}>
        {data.responses?.name ? `Great work, ${data.responses.name}! ` : ''}
        Here are your top matches.
      </Text>
      {majors.map((m, i) => (
        <MajorCard key={i} major={m} />
      ))}
    </>
  );
}

function MajorCard({ major }: { major: any }) {
  const [open, setOpen] = useState(false);
  return (
    <Card style={{ marginBottom: spacing.md }}>
      <Pressable style={styles.majorHeader} onPress={() => setOpen((o) => !o)}>
        <View style={{ flex: 1 }}>
          <Text style={styles.majorTitle}>{major.major}</Text>
          {major.match_score != null ? <Badge label={`${major.match_score}% match`} tone="green" /> : null}
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={22} color={colors.textFaint} />
      </Pressable>

      {major.overview ? <Text style={styles.body}>{major.overview}</Text> : null}

      {open && (
        <View style={{ marginTop: spacing.md, gap: spacing.md }}>
          {major.why_matches ? (
            <Section title="Why it fits you" body={major.why_matches} />
          ) : null}

          {Array.isArray(major.career_paths) && major.career_paths.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Career paths</Text>
              {major.career_paths.map((cp: any, i: number) => (
                <View key={i} style={styles.subCard}>
                  <Text style={styles.subTitle}>{cp.title}</Text>
                  {cp.definition ? <Text style={styles.body}>{cp.definition}</Text> : null}
                  {Array.isArray(cp.timeline) && cp.timeline.length > 0 ? (
                    <View style={styles.timeline}>
                      {cp.timeline.map((t: any, j: number) => (
                        <View key={j} style={styles.timelineRow}>
                          <View style={styles.dot} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.timelineStage}>
                              {t.stage}
                              {t.duration ? `  ·  ${t.duration}` : ''}
                            </Text>
                            {t.description ? <Text style={styles.timelineDesc}>{t.description}</Text> : null}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {major.salary_range ? <Section title="Salary range" body={major.salary_range} /> : null}
          {major.market_outlook ? <Section title="Market outlook (2025-2030)" body={major.market_outlook} /> : null}

          {Array.isArray(major.top_schools) && major.top_schools.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Top schools</Text>
              {major.top_schools.map((s: any, i: number) => (
                <View key={i} style={styles.subCard}>
                  <Text style={styles.subTitle}>{s.name}</Text>
                  <Text style={styles.muted}>
                    {[s.location, s.acceptance_rate && `Acceptance ${s.acceptance_rate}`, s.annual_tuition]
                      .filter(Boolean)
                      .join('  ·  ')}
                  </Text>
                  {s.why_excellent ? <Text style={styles.body}>{s.why_excellent}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}

          {Array.isArray(major.scholarships) && major.scholarships.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Scholarships</Text>
              {major.scholarships.map((s: any, i: number) => (
                <View key={i} style={styles.subCard}>
                  <Text style={styles.subTitle}>{s.name}</Text>
                  <Text style={styles.muted}>
                    {[s.provider, s.amount, s.deadline].filter(Boolean).join('  ·  ')}
                  </Text>
                  {s.description ? <Text style={styles.body}>{s.description}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>
      )}
    </Card>
  );
}

function GenericResults({ data }: { data: any }) {
  // Render structured result objects (reentry / switch) as readable sections.
  const entries = Object.entries(data).filter(([k]) => k !== 'responses');
  return (
    <>
      {entries.map(([key, value]) => (
        <Card key={key} style={{ marginBottom: spacing.md }}>
          <Text style={styles.sectionTitle}>{humanize(key)}</Text>
          <RenderValue value={value} />
        </Card>
      ))}
    </>
  );
}

function RenderValue({ value }: { value: any }): React.ReactElement {
  if (value == null) return <></>;
  if (typeof value === 'string' || typeof value === 'number') {
    return <Text style={styles.body}>{String(value)}</Text>;
  }
  if (Array.isArray(value)) {
    return (
      <View style={{ gap: spacing.sm }}>
        {value.map((v, i) => (
          <View key={i} style={styles.subCard}>
            <RenderValue value={v} />
          </View>
        ))}
      </View>
    );
  }
  return (
    <View style={{ gap: spacing.xs }}>
      {Object.entries(value).map(([k, v]) => (
        <View key={k}>
          <Text style={styles.subTitle}>{humanize(k)}</Text>
          <RenderValue value={v} />
        </View>
      ))}
    </View>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

function humanize(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  intro: { fontSize: 16, color: colors.textMuted, marginBottom: spacing.lg },
  empty: { gap: spacing.lg, alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { fontSize: 16, color: colors.textMuted, textAlign: 'center' },
  majorHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  majorTitle: { fontSize: 19, fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  subTitle: { fontSize: 15, fontWeight: '700', color: colors.primaryDark },
  body: { fontSize: 14, color: colors.textMuted, lineHeight: 21 },
  muted: { fontSize: 13, color: colors.textFaint, marginVertical: 2 },
  subCard: { backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm, gap: spacing.xs },
  timeline: { marginTop: spacing.sm, gap: spacing.sm },
  timelineRow: { flexDirection: 'row', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginTop: 5 },
  timelineStage: { fontSize: 14, fontWeight: '600', color: colors.text },
  timelineDesc: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 19 },
});
