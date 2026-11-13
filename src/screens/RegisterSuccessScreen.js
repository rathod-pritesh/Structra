import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import PrimaryButton from '../components/PrimaryButton';
import BrandHeader from '../components/BrandHeader';

export default function RegisterSuccessScreen({
  registeredUser = {},
  onNavigateToLogin,
  onNavigateToDashboard,
}) {
  const { name = 'Valued User', email = 'user@example.com' } = registeredUser;

  return (
    <View style={styles.container}>
      <BrandHeader showLogoOnly={true} />

      <View style={styles.card}>
        {/* Success Icon */}
        <View style={styles.iconCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Registration Completed</Text>
        <Text style={styles.subtitle}>
          Welcome to Structra, {name}!
        </Text>

        {/* Account Details Box */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name:</Text>
            <Text style={styles.detailValue}>{name}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email Address:</Text>
            <Text style={styles.detailValue}>{email}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email Status:</Text>
            <Text style={[styles.detailValue, { color: COLORS.success }]}>
              Verified (Demo)
            </Text>
          </View>
        </View>

        {/* Honest Demonstration Disclosure */}
        <View style={styles.demoDisclosure}>
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>SIMULATION NOTICE</Text>
          </View>
          <Text style={styles.demoText}>
            This registration process was simulated entirely within the mobile frontend.
            No personal information or passwords have been transmitted to any external backend,
            API, or saved into persistent storage.
          </Text>
        </View>

        {/* Action Button: Enter Dashboard & Back to Sign In */}
        <View style={styles.buttonContainer}>
          {onNavigateToDashboard && (
            <PrimaryButton
              title="Open Dashboard"
              onPress={onNavigateToDashboard}
              style={{ marginBottom: 10 }}
            />
          )}
          <PrimaryButton
            title="Back to Sign In"
            variant={onNavigateToDashboard ? 'outline' : 'primary'}
            onPress={onNavigateToLogin}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.successLight,
    borderWidth: 2,
    borderColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkIcon: {
    fontSize: 34,
    color: COLORS.success,
    fontWeight: '800',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsBox: {
    width: '100%',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 16,
    marginBottom: 18,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  detailDivider: {
    height: 1,
    backgroundColor: COLORS.inputBorder,
    marginVertical: 10,
  },
  demoDisclosure: {
    width: '100%',
    backgroundColor: COLORS.amberLight || '#FDF1E8',
    borderWidth: 1,
    borderColor: '#F2D3BE',
    borderRadius: 14,
    padding: 14,
    marginBottom: 22,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(234, 106, 32, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 0.6,
  },
  demoText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    width: '100%',
  },
});
