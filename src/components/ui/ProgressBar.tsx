import { View, StyleSheet } from 'react-native';
import { colors, radius } from '@/constants/colors';

export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden' },
  fill: { height: 8, backgroundColor: colors.primary, borderRadius: radius.full },
});
