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
import PrimaryButton from '../components/PrimaryButton';
import GoogleSignInButton from '../components/GoogleSignInButton';
import DemoModal from '../components/DemoModal';
import { validateName, validateEmail } from '../utils/validation';

export default function RegisterPersonalScreen({
  initialData = {},
  onContinue,
  onNavigateToLogin,
}) {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [errors, setErrors] = useState({ name: null, email: null });
  const [googleModalVisible, setGoogleModalVisible] = useState(false);

  const handleGooglePress = () => {
    Keyboard.dismiss();
    setGoogleModalVisible(true);
  };

  const handleNameChange = (text) => {
    setName(text);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: null }));
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };

  const handleContinue = () => {
    Keyboard.dismiss();

    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);

    if (!nameValidation.isValid || !emailValidation.isValid) {
      setErrors({
        name: nameValidation.error,
        email: emailValidation.error,
      });
      return;
    }

    // Advance to Stage 2 with preserved details
    onContinue({
      name: name.trim(),
      email: email.trim(),
    });
  };

  return (
    <View style={styles.container}>
      {/* Back button to return to Sign In */}
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

      {/* Progress indicator: Step 1 of 3 */}
      <ProgressIndicator currentStep={1} totalSteps={3} />

      {/* Structra Branding, Heading & Description */}
      <BrandHeader
        heading="Create your account"
        description="First, tell us a little about yourself."
      />

      {/* Full name input */}
      <AuthInput
        label="Full name"
        placeholder="e.g. Aarav Patel"
        value={name}
        onChangeText={handleNameChange}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        error={errors.name}
      />

      {/* Email address input */}
      <AuthInput
        label="Email address"
        placeholder="e.g. aarav.patel@structra.in"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        error={errors.email}
      />

      {/* Primary button: Continue */}
      <View style={styles.actionContainer}>
        <PrimaryButton title="Continue" onPress={handleContinue} />
      </View>

      {/* Visually separated OR divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Continue with Google button */}
      <GoogleSignInButton onPress={handleGooglePress} />

      {/* Bottom text: Already have an account? Sign in */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity
          onPress={onNavigateToLogin}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.footerActionText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* Informational Demo Modal */}
      <DemoModal
        visible={googleModalVisible}
        onClose={() => setGoogleModalVisible(false)}
        title="Google Sign-Up Unavailable"
        message="Google authentication is not configured in this demo build. External OAuth, Firebase, and backend services are intentionally not integrated in this frontend-only implementation."
        tagText="DEMO NOTICE"
      />
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
    marginTop: 8,
    marginBottom: 0,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  dividerText: {
    paddingHorizontal: 14,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footerActionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
