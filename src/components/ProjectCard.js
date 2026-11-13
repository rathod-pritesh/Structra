import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../constants/colors';

export default function ProjectCard({ project, onPress }) {
  const {
    name,
    category,
    location,
    progress = 0,
    status = 'In Progress',
    statusVariant = 'success',
    phase,
    deadline,
  } = project;

  // Status badge styling
  const isAccent = statusVariant === 'accent';
  const isNeutral = statusVariant === 'neutral';

  const badgeBg = isAccent
    ? COLORS.amberLight || 'rgba(234, 106, 32, 0.12)'
    : isNeutral
    ? '#EAF0F8'
    : COLORS.navyLight || 'rgba(27, 42, 74, 0.08)';

  const badgeText = isAccent
    ? COLORS.secondary
    : isNeutral
    ? COLORS.textSecondary
    : COLORS.primary;

  const progressFillColor = isAccent ? COLORS.secondary : COLORS.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Project ${name}, status ${status}, progress ${progress}%`}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleInfo}>
          <Text style={styles.projectName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.categoryLocation} numberOfLines={1}>
            {category} • {location}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.statusText, { color: badgeText }]}>
            {status}
          </Text>
        </View>
      </View>

      {/* Current Construction Phase */}
      {phase && (
        <View style={styles.phaseRow}>
          <Text style={styles.phaseLabel}>Phase: </Text>
          <Text style={styles.phaseValue} numberOfLines={1}>
            {phase}
          </Text>
        </View>
      )}

      {/* Progress Section */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>Completion</Text>
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>

        {/* Progress Bar Track & Fill */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(Math.max(progress, 0), 100)}%`, backgroundColor: progressFillColor },
            ]}
          />
        </View>
      </View>

      {/* Footer with target date */}
      {deadline && (
        <View style={styles.footerRow}>
          <Text style={styles.deadlineLabel}>Target: {deadline}</Text>
          <Text style={styles.detailsAction}>View Details →</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#FAFAF7',
    borderColor: '#CCCABF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  titleInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  categoryLocation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  phaseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  phaseValue: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ECEAE3',
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0EFE9',
  },
  deadlineLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailsAction: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
