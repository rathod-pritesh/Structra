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
  const {
    name = 'Applicant',
    email = 'user@structra.in',
    role = null,
  } = registeredUser;

  const roleLabel = role?.label || 'Site Personnel';
  const approverLabel = role?.approver || 'Site / Project Manager';

  return (
    <View style={styles.container}>
      <BrandHeader showLogoOnly={true} />

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.pendingIcon}>⏳</Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>PENDING APPROVAL</Text>
        </View>

        <Text style={styles.title}>Access Request Submitted</Text>
        <Text style={styles.subtitle}>
          Thank you, {name}. Your account is not active yet and is waiting for approval.
        </Text>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{name}</Text>
          </View>
          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email Address</Text>
            <Text style={styles.detailValue}>{email}</Text>
          </View>
          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Requested Role</Text>
            <Text style={styles.detailValue}>{roleLabel}</Text>
          </View>
          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Approver</Text>
            <Text style={[styles.detailValue, { color: COLORS.primary }]}>
              {approverLabel}
            </Text>
          </View>
          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Status</Text>
            <Text style={[styles.detailValue, { color: COLORS.secondary }]}>
              Pending Review
            </Text>
          </View>
        </View>

        <View style={styles.gateBox}>
          <Text style={styles.gateHeader}>APPROVAL WORKFLOW</Text>

          <View style={styles.gateStep}>
            <View style={[styles.gateDot, styles.gateDotDone]}>
              <Text style={styles.gateDotText}>✓</Text>
            </View>
            <Text style={styles.gateStepText}>1. Email Verified</Text>
          </View>

          <View style={styles.gateStep}>
            <View style={[styles.gateDot, styles.gateDotActive]}>
              <Text style={styles.gateDotText}>2</Text>
            </View>
            <Text style={styles.gateStepTextActive}>
              2. {approverLabel} Approval (In Queue)
            </Text>
          </View>

          <View style={styles.gateStep}>
            <View style={[styles.gateDot, styles.gateDotIdle]}>
              <Text style={styles.gateDotTextIdle}>3</Text>
            </View>
            <Text style={styles.gateStepTextIdle}>3. Account Activated & Ready</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Back to Sign In"
            onPress={onNavigateToLogin}
            style={{ marginBottom: 10 }}
          />
          {onNavigateToDashboard && (
            <PrimaryButton
              title={`Preview as ${roleLabel} (UI Demo)`}
              variant="outline"
              onPress={onNavigateToDashboard}
            />
          )}
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
    backgroundColor: COLORS.amberLight || '#FDF1E8',
    borderWidth: 2,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  pendingIcon: {
    fontSize: 30,
  },
  statusPill: {
    backgroundColor: 'rgba(234, 106, 32, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 0.7,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 16,
    marginBottom: 16,
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
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  detailDivider: {
    height: 1,
    backgroundColor: COLORS.inputBorder,
    marginVertical: 10,
  },
  gateBox: {
    width: '100%',
    backgroundColor: COLORS.navyLight || '#EEF2F8',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  gateHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  gateStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gateDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gateDotDone: {
    backgroundColor: COLORS.success,
  },
  gateDotActive: {
    backgroundColor: COLORS.secondary,
  },
  gateDotIdle: {
    backgroundColor: COLORS.inputBorder,
  },
  gateDotText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  gateDotTextIdle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  gateStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  gateStepTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  gateStepTextIdle: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    width: '100%',
  },
});
