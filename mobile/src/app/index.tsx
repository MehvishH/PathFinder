import { ScrollView, Text, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FLOWS, FlowKey } from '@/data/quizzes';
import { colors, gradients, radius, spacing } from '@/constants/colors';

export default function Home() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.logoBadge}>
            <Ionicons name="compass-outline" size={28} color={colors.white} />
          </View>
          <Text style={styles.heroTitle}>PathFinder</Text>
          <Text style={styles.heroSubtitle}>
            Discover the right path — whether you're starting out, coming back, or changing direction.
          </Text>
        </LinearGradient>

        <Text style={styles.sectionLabel}>Choose your journey</Text>

        {(Object.keys(FLOWS) as FlowKey[]).map((key) => {
          const flow = FLOWS[key];
          return (
            <Pressable
              key={key}
              style={({ pressed }) => [styles.flowCard, pressed && styles.pressed]}
              onPress={() => router.push(`/quiz/${key}`)}>
              <View style={styles.flowIcon}>
                <Ionicons name={flow.icon as any} size={26} color={colors.primary} />
              </View>
              <View style={styles.flowText}>
                <Text style={styles.flowTitle}>{flow.title}</Text>
                <Text style={styles.flowSubtitle}>{flow.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textFaint} />
            </Pressable>
          );
        })}

        <Pressable
          style={({ pressed }) => [styles.assistantCard, pressed && styles.pressed]}
          onPress={() => router.push('/assistant')}>
          <Ionicons name="sparkles" size={22} color={colors.white} />
          <View style={styles.flowText}>
            <Text style={styles.assistantTitle}>Ask the AI Career Coach</Text>
            <Text style={styles.assistantSubtitle}>Get answers to any career or education question</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.white} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  hero: { borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.sm },
  logoBadge: {
    width: 56, height: 56, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  heroTitle: { fontSize: 32, fontWeight: '800', color: colors.white },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: spacing.sm, lineHeight: 22 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.sm },
  flowCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg,
  },
  flowIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.indigo50, alignItems: 'center', justifyContent: 'center' },
  flowText: { flex: 1 },
  flowTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  flowSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  assistantCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primary,
    borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.sm,
  },
  assistantTitle: { fontSize: 17, fontWeight: '700', color: colors.white },
  assistantSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  pressed: { opacity: 0.7 },
});
