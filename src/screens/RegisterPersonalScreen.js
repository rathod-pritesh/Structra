import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { USER_ROLES } from '../constants/authConstants';
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
  const [selectedRole, setSelectedRole] = useState(initialData.role || null);
  const [errors, setErrors] = useState({ name: null, email: null, role: null });
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

  const handleRoleSelect = (roleObj) => {
    setSelectedRole(roleObj);
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: null }));
    }
  };

  const handleContinue = () => {
    Keyboard.dismiss();

    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const roleError = selectedRole ? null : 'Please select your site role.';

    if (!nameValidation.isValid || !emailValidation.isValid || roleError) {
      setErrors({
        name: nameValidation.error,
        email: emailValidation.error,
        role: roleError,
      });
      return;
    }

    onContinue({
      name: name.trim(),
      email: email.trim(),
      role: selectedRole,
    });
  };

  return (
    <View style={styles.container}>
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

      <ProgressIndicator currentStep={1} totalSteps={3} />

      <BrandHeader
        heading="Create your account"
        description="First, tell us a little about yourself."
      />

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
        placeholder="e.g. name@structra.in"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        error={errors.email}
      />

      {/* Role Selection */}
      <View style={styles.roleSection}>
        <Text style={styles.roleLabel}>Select your role</Text>
        <Text style={styles.roleHint}>
          Your access request will be routed for approval based on your role.
        </Text>

        {USER_ROLES.map((roleObj) => {
          const isSelected = selectedRole?.id === roleObj.id;
          return (
            <TouchableOpacity
              key={roleObj.id}
              onPress={() => handleRoleSelect(roleObj)}
              style={[
                styles.roleCard,
                isSelected && styles.roleCardSelected,
                errors.role && !selectedRole && styles.roleCardError,
              ]}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
            >
              <View style={styles.roleCardContent}>
                <Text
                  style={[
                    styles.roleCardTitle,
                    isSelected && styles.roleCardTitleSelected,
                  ]}
                >
                  {roleObj.label}
                </Text>
                <Text style={styles.roleCardDesc}>{roleObj.shortDesc}</Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  isSelected && styles.radioOuterSelected,
                ]}
              >
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {errors.role ? (
          <Text style={styles.roleErrorText}>{errors.role}</Text>
        ) : null}

        {selectedRole ? (
          <View style={styles.approvalNotice}>
            <Text style={styles.approvalNoticeTitle}>Approval Routing</Text>
            <Text style={styles.approvalNoticeText}>
              Requests for <Text style={styles.boldText}>{selectedRole.label}</Text> are
              reviewed & activated by{' '}
              <Text style={styles.boldText}>{selectedRole.approver}</Text>.
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actionContainer}>
        <PrimaryButton title="Continue" onPress={handleContinue} />
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <GoogleSignInButton onPress={handleGooglePress} />

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
  roleSection: {
    marginTop: 4,
    marginBottom: 14,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  roleHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 8,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.navyLight || '#EEF2F8',
  },
  roleCardError: {
    borderColor: COLORS.error,
  },
  roleCardContent: {
    flex: 1,
    paddingRight: 10,
  },
  roleCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  roleCardTitleSelected: {
    color: COLORS.primary,
  },
  roleCardDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  roleErrorText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 6,
  },
  approvalNotice: {
    backgroundColor: COLORS.amberLight || '#FDF1E8',
    borderWidth: 1,
    borderColor: '#F2D3BE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  approvalNoticeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  approvalNoticeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
