import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const STEP_LABELS = {
  1: 'Personal Details',
  2: 'Email Verification',
  3: 'Set Password',
};

export default function ProgressIndicator({ currentStep = 1, totalSteps = 3 }) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: totalSteps, now: currentStep }}>
      <View style={styles.textRow}>
        <Text style={styles.stepCounter}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.stepTitle}>
          {STEP_LABELS[currentStep] || ''}
        </Text>
      </View>

      <View style={styles.barsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <View
              key={index}
              style={[
                styles.segment,
                (isCompleted || isActive) && styles.segmentActive,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  barsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.inputBorder,
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
  },
});
