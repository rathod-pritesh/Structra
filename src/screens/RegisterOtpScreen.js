import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { COLORS } from '../constants/colors';
import BrandHeader from '../components/BrandHeader';
import ProgressIndicator from '../components/ProgressIndicator';
import OtpInput from '../components/OtpInput';
import PrimaryButton from '../components/PrimaryButton';
import DemoNotice from '../components/DemoNotice';
import { DEMO_OTP_CODE } from '../constants/authConstants';

export default function RegisterOtpScreen({
  email = '',
  onVerified,
  onBack,
}) {
  const [demoCode, setDemoCode] = useState(DEMO_OTP_CODE);
  const [enteredCode, setEnteredCode] = useState('');
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendNotice, setResendNotice] = useState(null);

  const handleCodeChange = (text) => {
    setEnteredCode(text);
    if (error) setError(null);
    if (resendNotice) setResendNotice(null);
  };

  const handleUseDemoCode = () => {
    setEnteredCode(demoCode);
    if (error) setError(null);
    Keyboard.dismiss();
  };

  const handleVerify = () => {
    Keyboard.dismiss();

    if (enteredCode.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    if (enteredCode !== demoCode) {
      setError(`Invalid code. Expected demo code: ${demoCode}.`);
      return;
    }

    // Correct demo code entered!
    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);

      // Transition to Stage 3 after brief visual confirmation
      setTimeout(() => {
        onVerified();
      }, 500);
    }, 400);
  };

  const handleResendCode = () => {
    Keyboard.dismiss();
    // Generate a fresh 6-digit demo code for simulation
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoCode(newCode);
    setEnteredCode('');
    setError(null);
    setResendNotice(`Demo code refreshed to ${newCode}. (Simulation: No actual email was sent)`);
  };

  return (
    <View style={styles.container}>
      {/* Back button to return to Stage 1 */}
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Back to Personal Details"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.backButtonArrow}>←</Text>
        <Text style={styles.backButtonText}>Back to Personal Details</Text>
      </TouchableOpacity>

      {/* Progress indicator: Step 2 of 3 */}
      <ProgressIndicator currentStep={2} totalSteps={3} />

      {/* Brand & Heading */}
      <BrandHeader
        heading="Verify your email"
        description="Enter the verification code sent to your email address."
      />

      {/* Display email entered in Stage 1 */}
      <View style={styles.emailCard}>
        <Text style={styles.emailLabel}>Verification target:</Text>
        <Text style={styles.emailValue}>{email || 'your-email@example.com'}</Text>
      </View>

      {/* Clear Honest Demo Notice */}
      <DemoNotice
        title="Email Simulation"
        message="Email delivery is not configured in this demo. Use the disclosed demo code below to test verification."
      />

      {/* Demo Code Box with Quick-Fill Action */}
      <View style={styles.demoCodeBox}>
        <View style={styles.demoCodeInfo}>
          <Text style={styles.demoCodeLabel}>Active Demo Code:</Text>
          <Text style={styles.demoCodeValue}>{demoCode}</Text>
        </View>
        <TouchableOpacity
          onPress={handleUseDemoCode}
          style={styles.useCodeButton}
          accessibilityRole="button"
          accessibilityLabel="Use demo code"
          activeOpacity={0.7}
        >
          <Text style={styles.useCodeText}>Auto-Fill</Text>
        </TouchableOpacity>
      </View>

      {/* Resend simulated feedback notice */}
      {resendNotice && (
        <View style={styles.resendNoticeBadge}>
          <Text style={styles.resendNoticeText}>{resendNotice}</Text>
        </View>
      )}

      {/* Six-digit OTP input interface */}
      <OtpInput
        code={enteredCode}
        onChangeCode={handleCodeChange}
        hasError={!!error}
        isSuccess={isVerified}
        disabled={isVerifying || isVerified}
      />

      {/* Inline validation error */}
      {error && (
        <View style={styles.errorContainer}>
          <View style={styles.errorDot} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Verification success indicator */}
      {isVerified && (
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successText}>Demo code verified! Proceeding to Step 3...</Text>
        </View>
      )}

      {/* Primary button: Verify email */}
      <View style={styles.actionContainer}>
        <PrimaryButton
          title={isVerified ? 'Verified ✓' : 'Verify email'}
          onPress={handleVerify}
          loading={isVerifying}
          disabled={isVerified || enteredCode.length < 6}
        />
      </View>

      {/* Secondary action: Resend code (Simulated frontend action) */}
      <View style={styles.resendContainer}>
        <TouchableOpacity
          onPress={handleResendCode}
          style={styles.resendButton}
          accessibilityRole="button"
          accessibilityLabel="Resend demo verification code"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.resendText}>Resend code (Simulated)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButtonArrow: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '700',
    marginRight: 6,
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emailCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  emailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emailValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  demoCodeBox: {
    backgroundColor: COLORS.amberLight || '#FDF1E8',
    borderWidth: 1,
    borderColor: '#F2D3BE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  demoCodeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoCodeLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  demoCodeValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  useCodeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  useCodeText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '700',
  },
  resendNoticeBadge: {
    backgroundColor: COLORS.card,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 6,
  },
  resendNoticeText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  errorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
    marginRight: 6,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '500',
    textAlign: 'center',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.successLight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  successIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.success,
    marginRight: 6,
  },
  successText: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '600',
  },
  actionContainer: {
    marginTop: 10,
    marginBottom: 12,
  },
  resendContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
});
