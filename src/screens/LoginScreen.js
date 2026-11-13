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
import GoogleSignInButton from '../components/GoogleSignInButton';
import DemoModal from '../components/DemoModal';
import { validateEmail } from '../utils/validation';

export default function LoginScreen({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onLoginSuccess,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: null, password: null });
  const [isLoading, setIsLoading] = useState(false);

  // Demo modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    tagText: 'FRONTEND DEMO',
    buttonText: 'Understood',
    onAction: null,
  });

  const handleEmailChange = (text) => {
    setEmail(text);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: null }));
    }
  };

  const handleSignIn = () => {
    Keyboard.dismiss();

    const emailValidation = validateEmail(email);
    let passwordError = null;

    if (!password || password.trim().length === 0) {
      passwordError = 'Password is required to sign in.';
    }

    if (!emailValidation.isValid || passwordError) {
      setErrors({
        email: emailValidation.error,
        password: passwordError,
      });
      return;
    }

    // Begin simulated frontend-only authentication
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setModalConfig({
        title: 'Demo Sign In Successful',
        message: `Welcome to Structra! Credentials format validated for ${email.trim()}.\n\nTap below to enter your Construction Project Management Dashboard.`,
        tagText: 'DEMO SUCCESS',
        buttonText: 'Enter Dashboard →',
        onAction: () => {
          if (onLoginSuccess) {
            onLoginSuccess({
              name: 'Aarav Patel',
              email: email.trim(),
              role: 'Chief Project Director',
              company: 'Structra Infra Gujarat Ltd',
              initials: 'AP',
            });
          }
        },
      });
      setModalVisible(true);
    }, 900);
  };

  const handleGooglePress = () => {
    Keyboard.dismiss();
    setModalConfig({
      title: 'Google Sign-In Unavailable',
      message: 'Google authentication is not configured in this demo build. External OAuth, Firebase, and backend services are intentionally not integrated in this frontend-only implementation.',
      tagText: 'DEMO NOTICE',
      buttonText: 'Understood',
      onAction: null,
    });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* 1. Brand Mark & Name, 2. Heading, 3. Supporting Text */}
      <BrandHeader
        heading="Welcome back"
        description="Sign in to continue to your Structra account."
      />

      {/* 4. Email input field */}
      <AuthInput
        label="Email address"
        placeholder="Enter your email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        error={errors.email}
        editable={!isLoading}
      />

      {/* 5. Password input field & 6. Password visibility toggle */}
      <AuthInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={handlePasswordChange}
        isPassword={true}
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        error={errors.password}
        editable={!isLoading}
      />

      {/* 7. Forgot password? text button */}
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity
          onPress={onNavigateToForgotPassword}
          accessibilityRole="button"
          accessibilityLabel="Forgot password"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* 8. Primary Sign In button */}
      <PrimaryButton
        title="Sign In"
        onPress={handleSignIn}
        loading={isLoading}
      />

      {/* 9. Visually separated OR divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* 10. Continue with Google button */}
      <GoogleSignInButton onPress={handleGooglePress} />

      {/* 11. Bottom text: Don't have an account? Sign up */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity
          onPress={onNavigateToRegister}
          accessibilityRole="button"
          accessibilityLabel="Sign up for Structra"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.footerActionText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Informational Demo Modal */}
      <DemoModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          if (modalConfig.onAction) {
            modalConfig.onAction();
          }
        }}
        title={modalConfig.title}
        message={modalConfig.message}
        tagText={modalConfig.tagText}
        buttonText={modalConfig.buttonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: -6,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
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
    marginTop: 26,
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
