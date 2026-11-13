import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SummaryCard({
  title,
  value,
  subtext,
  variant = 'primary', // 'primary' (forest green) | 'accent' (terracotta) | 'success'
  style,
}) {
  const isAccent = variant === 'accent';
  const isSuccess = variant === 'success';

  const badgeBg = isAccent
    ? COLORS.amberLight || 'rgba(234, 106, 32, 0.12)'
    : isSuccess
    ? COLORS.successLight || 'rgba(40, 122, 84, 0.12)'
    : COLORS.navyLight || 'rgba(27, 42, 74, 0.08)';

  const badgeColor = isAccent
    ? COLORS.secondary
    : isSuccess
    ? COLORS.success
    : COLORS.primary;

  const topBarColor = isAccent
    ? COLORS.secondary
    : isSuccess
    ? COLORS.success
    : COLORS.primary;

  return (
    <View style={[styles.card, style]}>
      {/* Top accent bar */}
      <View style={[styles.topBar, { backgroundColor: topBarColor }]} />

      <View style={styles.content}>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          {subtext && (
            <View style={[styles.badge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>
                {subtext}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  topBar: {
    height: 3,
    width: '100%',
  },
  content: {
    padding: 14,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
});
