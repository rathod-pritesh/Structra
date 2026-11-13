import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { evaluatePasswordRules } from '../utils/validation';

export default function PasswordRequirements({ password = '' }) {
  const rules = evaluatePasswordRules(password);

  const checklist = [
    { key: 'minLength', label: 'At least 8 characters', met: rules.minLength },
    { key: 'hasUpper', label: 'One uppercase letter (A-Z)', met: rules.hasUpper },
    { key: 'hasLower', label: 'One lowercase letter (a-z)', met: rules.hasLower },
    { key: 'hasNumber', label: 'One number (0-9)', met: rules.hasNumber },
    { key: 'hasSpecial', label: 'One special character (!@#$...)', met: rules.hasSpecial },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password security checklist</Text>
      <View style={styles.list}>
        {checklist.map((item) => (
          <View key={item.key} style={styles.itemRow}>
            <View
              style={[
                styles.iconCircle,
                item.met ? styles.iconCircleMet : styles.iconCircleUnmet,
              ]}
            >
              {item.met ? (
                <Text style={styles.checkIcon}>✓</Text>
              ) : (
                <View style={styles.unmetDot} />
              )}
            </View>
            <Text
              style={[
                styles.label,
                item.met ? styles.labelMet : styles.labelUnmet,
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F6F0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 16,
    marginVertical: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  list: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconCircleMet: {
    backgroundColor: COLORS.success,
  },
  iconCircleUnmet: {
    backgroundColor: '#E6E4DD',
  },
  checkIcon: {
    color: COLORS.card,
    fontSize: 12,
    fontWeight: '800',
  },
  unmetDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textSecondary,
  },
  label: {
    fontSize: 13,
  },
  labelMet: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  labelUnmet: {
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
});
