import { useRef, useState } from 'react';
import {
  ScrollView, Text, View, StyleSheet, Pressable, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { sendChat, ChatMessage } from '@/lib/api';
import { colors, radius, spacing } from '@/constants/colors';

const SUGGESTIONS = [
  'How do I write a resume with no experience?',
  'What scholarships should I apply for?',
  'How do I prepare for a job interview?',
];

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const { reply } = await sendChat(next);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setMessages([...next, { role: 'assistant', content: `Sorry — I couldn't reach the coach. ${e?.message ?? ''}` }]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>AI Career Coach</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {messages.length === 0 ? (
            <View style={styles.intro}>
              <View style={styles.introIcon}>
                <Ionicons name="sparkles" size={28} color={colors.primary} />
              </View>
              <Text style={styles.introTitle}>Ask me anything</Text>
              <Text style={styles.introSubtitle}>
                Careers, majors, resumes, scholarships, interviews — I'm here to help.
              </Text>
              <View style={{ gap: spacing.sm, marginTop: spacing.lg, width: '100%' }}>
                {SUGGESTIONS.map((s) => (
                  <Pressable key={s} style={styles.suggestion} onPress={() => send(s)}>
                    <Text style={styles.suggestionText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            messages.map((m, i) => (
              <View key={i} style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={m.role === 'user' ? styles.userText : styles.aiText}>{m.content}</Text>
              </View>
            ))
          )}
          {loading ? (
            <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask a question..."
            placeholderTextColor={colors.textFaint}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
            multiline
          />
          <Pressable
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => send(input)}
            disabled={!input.trim() || loading}>
            <Ionicons name="arrow-up" size={22} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  messages: { padding: spacing.lg, gap: spacing.md, flexGrow: 1 },
  intro: { alignItems: 'center', paddingTop: spacing.xxl },
  introIcon: { width: 64, height: 64, borderRadius: radius.lg, backgroundColor: colors.indigo50, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  introTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  introSubtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  suggestion: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  suggestionText: { fontSize: 14, color: colors.primaryDark, fontWeight: '500' },
  bubble: { maxWidth: '85%', borderRadius: radius.lg, padding: spacing.md },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  loadingBubble: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  userText: { color: colors.white, fontSize: 15, lineHeight: 22 },
  aiText: { color: colors.text, fontSize: 15, lineHeight: 22 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
  input: { flex: 1, maxHeight: 120, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 15, color: colors.text, backgroundColor: colors.card },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
});
