import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '@/constants/colors';

type Tone = 'default' | 'green' | 'purple' | 'blue' | 'amber';

const tones: Record<Tone, { bg: string; fg: string }> = {
  default: { bg: colors.indigo50, fg: colors.primaryDark },
  green: { bg: colors.green100, fg: colors.green700 },
  purple: { bg: colors.purple100, fg: colors.purple700 },
  blue: { bg: colors.indigo100, fg: colors.blue600 },
  amber: { bg: colors.amber100, fg: colors.amber700 },
};

export function Badge({ label, tone = 'default' }: { label: string; tone?: Tone }) {
  const t = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '600' },
});
