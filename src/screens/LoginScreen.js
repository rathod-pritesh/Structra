import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { LOGIN_ROLES, DEMO_LOGIN_ACCOUNTS } from '../constants/authConstants';
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
  const [selectedRole, setSelectedRole] = useState(LOGIN_ROLES[0]);
  const [errors, setErrors] = useState({ email: null, password: null });
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setModalConfig({
        title: 'Demo Sign In Successful',
        message: `Welcome to Structra! Signed in as ${selectedRole.label} (${email.trim()}).\n\nTap below to enter your Construction Project Management Dashboard.`,
        tagText: 'DEMO SUCCESS',
        buttonText: 'Enter Dashboard →',
        onAction: () => {
          if (onLoginSuccess) {
            const rawPrefix = email.trim().split('@')[0] || 'User';
            const cleanName = rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1);
            onLoginSuccess({
              name: cleanName,
              email: email.trim(),
              role: selectedRole.label,
              company: 'Structra Construction',
              initials: cleanName.slice(0, 2).toUpperCase(),
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
      <BrandHeader
        heading="Welcome back"
        description="Sign in to continue to your Structra account."
      />

      <View style={styles.roleWrapper}>
        <Text style={styles.roleTitle}>Account Role</Text>
        <View style={styles.roleChipsRow}>
          {LOGIN_ROLES.map((roleObj) => {
            const active = selectedRole.id === roleObj.id;
            return (
              <TouchableOpacity
                key={roleObj.id}
                onPress={() => setSelectedRole(roleObj)}
                style={[styles.roleChip, active && styles.roleChipActive]}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={[styles.roleChipText, active && styles.roleChipTextActive]}>
                  {roleObj.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

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

      <PrimaryButton
        title="Sign In"
        onPress={handleSignIn}
        loading={isLoading}
      />

      <View style={styles.demoSection}>
        <Text style={styles.demoSectionTitle}>Quick Role Demo Login</Text>
        <Text style={styles.demoSectionSub}>
          Tap any role to jump directly into its dedicated UI
        </Text>
        <View style={styles.demoGrid}>
          {DEMO_LOGIN_ACCOUNTS.map((acc) => (
            <TouchableOpacity
              key={acc.id}
              onPress={() => {
                if (onLoginSuccess) {
                  onLoginSuccess({
                    name: acc.name,
                    email: acc.email,
                    role: acc.label,
                    company: 'Structra Construction',
                    initials: acc.initials,
                  });
                }
              }}
              style={styles.demoRoleCard}
              activeOpacity={0.8}
            >
              <Text style={styles.demoRoleTitle}>{acc.label}</Text>
              <Text style={styles.demoRoleTag}>{acc.tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <GoogleSignInButton onPress={handleGooglePress} />

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
  roleWrapper: {
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  roleChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  roleChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  demoSection: {
    marginTop: 18,
    backgroundColor: COLORS.navyLight || '#EEF2F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 14,
  },
  demoSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  demoSectionSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoRoleCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  demoRoleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  demoRoleTag: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondary,
  },
});
