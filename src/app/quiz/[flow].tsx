import { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { FLOWS, FlowKey } from '@/data/quizzes';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getRecommendations } from '@/lib/api';
import { setResult } from '@/lib/store';
import { colors, radius, spacing } from '@/constants/colors';

type Answer = string | string[];

// Pre-render one static page per flow for the website build.
export function generateStaticParams(): { flow: FlowKey }[] {
  return (Object.keys(FLOWS) as FlowKey[]).map((flow) => ({ flow }));
}

export default function QuizScreen() {
  const { flow } = useLocalSearchParams<{ flow: FlowKey }>();
  const meta = FLOWS[flow as FlowKey];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!meta) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Unknown quiz.</Text>
      </SafeAreaView>
    );
  }

  const question = meta.questions[index];
  const progress = ((index + 1) / meta.questions.length) * 100;
  const current = answers[question.id];

  const canProceed = () => {
    if (!current) return false;
    if (Array.isArray(current)) return current.length > 0;
    return current.trim().length > 0;
  };

  const setAnswer = (value: Answer) => setAnswers((prev) => ({ ...prev, [question.id]: value }));

  const toggleMulti = (option: string) => {
    const list = Array.isArray(current) ? [...current] : [];
    const i = list.indexOf(option);
    if (i >= 0) list.splice(i, 1);
    else list.push(option);
    setAnswer(list);
  };

  const onNext = async () => {
    if (index < meta.questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    setSubmitting(true);
    try {
      const { result } = await getRecommendations(meta.key, answers);
      setResult(meta.key, { responses: answers, ...result });
      router.replace(`/results/${meta.key}`);
    } catch (e: any) {
      Alert.alert('Something went wrong', e?.message ?? 'Could not generate your recommendations. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onBack = () => {
    if (index > 0) setIndex(index - 1);
    else router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.stepText}>
          {index + 1} of {meta.questions.length}
        </Text>
      </View>
      <View style={styles.progressWrap}>
        <ProgressBar value={progress} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.question}>{question.question}</Text>
        {question.description ? <Text style={styles.description}>{question.description}</Text> : null}

        <View style={styles.options}>
          {question.type === 'text' && (
            <TextInput
              style={styles.input}
              placeholder={question.placeholder ?? 'Type your answer'}
              placeholderTextColor={colors.textFaint}
              value={typeof current === 'string' ? current : ''}
              onChangeText={setAnswer}
              autoFocus
            />
          )}

          {question.type !== 'text' &&
            question.options?.map((option) => {
              const selected = Array.isArray(current)
                ? current.includes(option)
                : current === option;
              return (
                <Pressable
                  key={option}
                  style={[styles.option, selected && styles.optionSelected]}
                  onPress={() =>
                    question.type === 'multiple' ? toggleMulti(option) : setAnswer(option)
                  }>
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                </Pressable>
              );
            })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={index < meta.questions.length - 1 ? 'Continue' : 'Get My Results'}
          onPress={onNext}
          disabled={!canProceed()}
          loading={submitting}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  stepText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  progressWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  question: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  description: { fontSize: 15, color: colors.textMuted, marginTop: spacing.sm },
  options: { marginTop: spacing.xl, gap: spacing.sm },
  input: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg,
    fontSize: 16, color: colors.text, backgroundColor: colors.card,
  },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg,
    backgroundColor: colors.card,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.indigo50 },
  optionText: { fontSize: 16, color: colors.text, flex: 1, paddingRight: spacing.sm },
  optionTextSelected: { color: colors.primaryDark, fontWeight: '600' },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  errorText: { padding: spacing.lg, fontSize: 16, color: colors.danger },
});
