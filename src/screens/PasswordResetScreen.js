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
import AuthInput from '../components/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import DemoNotice from '../components/DemoNotice';
import { validateEmail } from '../utils/validation';

export default function PasswordResetScreen({ onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
    if (error) setError(null);
    if (isSubmitted) setIsSubmitted(false);
  };

  const handleResetSubmit = () => {
    Keyboard.dismiss();

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <View style={styles.container}>
      {/* Back button to return to Login */}
      <TouchableOpacity
        onPress={onNavigateToLogin}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Back to Sign In"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.backButtonArrow}>←</Text>
        <Text style={styles.backButtonText}>Back to Sign In</Text>
      </TouchableOpacity>

      {/* Brand & Heading */}
      <BrandHeader
        heading="Reset your password"
        description="Enter your email address to begin the password recovery process."
      />

      {/* Honest informational message */}
      <DemoNotice
        title="Simulation Notice"
        message="Actual password reset email delivery is not configured in this demo application. No external emails or tokens will be dispatched."
      />

      {!isSubmitted ? (
        <>
          {/* Email input */}
          <AuthInput
            label="Account email address"
            placeholder="e.g. name@example.com"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={error}
            editable={!isLoading}
          />

          {/* Continue button */}
          <View style={styles.actionContainer}>
            <PrimaryButton
              title="Continue"
              onPress={handleResetSubmit}
              loading={isLoading}
            />
          </View>

          {/* Secondary return to sign in link */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={onNavigateToLogin}
              accessibilityRole="button"
              accessibilityLabel="Cancel and return to Sign In"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.cancelText}>Cancel and return to Sign In</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        /* Demo submission outcome state */
        <View style={styles.resultCard}>
          <View style={styles.resultIconCircle}>
            <Text style={styles.resultCheck}>✓</Text>
          </View>
          <Text style={styles.resultTitle}>Recovery Request Validated</Text>
          <Text style={styles.resultDescription}>
            Email format for <Text style={styles.highlightText}>{email.trim()}</Text> is valid.
          </Text>
          <Text style={styles.resultNote}>
            In a connected production system, a secure reset token would now be emailed.
            As this is a strictly frontend demo, no transmission took place.
          </Text>

          <View style={styles.resultAction}>
            <PrimaryButton
              title="Back to Sign In"
              onPress={onNavigateToLogin}
            />
          </View>
        </View>
      )}
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
  actionContainer: {
    marginTop: 10,
    marginBottom: 16,
  },
  footerRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  resultIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultCheck: {
    fontSize: 24,
    color: COLORS.success,
    fontWeight: '800',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  highlightText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  resultNote: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    backgroundColor: '#F8F6F0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultAction: {
    width: '100%',
  },
});
