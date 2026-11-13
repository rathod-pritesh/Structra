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
import AuthInput from '../components/AuthInput';
import PasswordRequirements from '../components/PasswordRequirements';
import PrimaryButton from '../components/PrimaryButton';
import {
  validatePassword,
  validateConfirmPassword,
} from '../utils/validation';

export default function RegisterPasswordScreen({
  name = '',
  email = '',
  isEmailVerified = false,
  onComplete,
  onBack,
}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ password: null, confirmPassword: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: null }));
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: null }));
    }
  };

  const handleCreateAccount = () => {
    Keyboard.dismiss();

    if (!isEmailVerified) {
      setErrors((prev) => ({
        ...prev,
        password: 'Email verification must be completed first.',
      }));
      return;
    }

    const passwordValidation = validatePassword(password);
    const confirmValidation = validateConfirmPassword(password, confirmPassword);

    if (!passwordValidation.isValid || !confirmValidation.isValid) {
      setErrors({
        password: passwordValidation.error,
        confirmPassword: confirmValidation.error,
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate backend account creation delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Pass safe registration details only (no passwords retained)
      onComplete({
        name,
        email,
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Back navigation */}
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Back to Email Verification"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.backButtonArrow}>←</Text>
        <Text style={styles.backButtonText}>Back to Verification</Text>
      </TouchableOpacity>

      {/* Progress indicator: Step 3 of 3 */}
      <ProgressIndicator currentStep={3} totalSteps={3} />

      {/* Heading & description */}
      <BrandHeader
        heading="Create a password"
        description="Your email is verified. Set a password to complete your registration."
      />

      {/* Clear Email-Verified Badge */}
      <View style={styles.verifiedBadge}>
        <View style={styles.verifiedIconCircle}>
          <Text style={styles.verifiedCheck}>✓</Text>
        </View>
        <View style={styles.verifiedInfo}>
          <Text style={styles.verifiedStatus}>Email Verified</Text>
          <Text style={styles.verifiedEmail}>{email || 'Verified user'}</Text>
        </View>
      </View>

      {/* Password input */}
      <AuthInput
        label="Create password"
        placeholder="Enter a strong password"
        value={password}
        onChangeText={handlePasswordChange}
        isPassword={true}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        error={errors.password}
        editable={!isSubmitting}
      />

      {/* Live interactive password requirements checklist */}
      <PasswordRequirements password={password} />

      {/* Confirm password input */}
      <AuthInput
        label="Confirm password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        isPassword={true}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        error={errors.confirmPassword}
        editable={!isSubmitting}
      />

      {/* Primary button: Create account */}
      <View style={styles.actionContainer}>
        <PrimaryButton
          title="Create account"
          onPress={handleCreateAccount}
          loading={isSubmitting}
        />
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
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: '#C7E4D3',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  verifiedIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  verifiedCheck: {
    color: COLORS.card,
    fontSize: 15,
    fontWeight: '800',
  },
  verifiedInfo: {
    flex: 1,
  },
  verifiedStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  verifiedEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionContainer: {
    marginTop: 10,
    marginBottom: 24,
  },
});
