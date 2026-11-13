import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { COLORS } from './src/constants/colors';
import { SCREEN_STATES } from './src/constants/authConstants';
import { MOCK_USER } from './src/data/mockData';

// Screen Components
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterPersonalScreen from './src/screens/RegisterPersonalScreen';
import RegisterOtpScreen from './src/screens/RegisterOtpScreen';
import RegisterPasswordScreen from './src/screens/RegisterPasswordScreen';
import RegisterSuccessScreen from './src/screens/RegisterSuccessScreen';
import PasswordResetScreen from './src/screens/PasswordResetScreen';
import MainAppContainer from './src/screens/MainAppContainer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREEN_STATES.SPLASH);
  const [currentUser, setCurrentUser] = useState(MOCK_USER);

  // Persistent registration draft during the 3-stage flow
  const [registrationDraft, setRegistrationDraft] = useState({
    name: '',
    email: '',
    isEmailVerified: false,
  });

  // Safe registration result for success display (no passwords stored)
  const [registeredUser, setRegisteredUser] = useState(null);

  // Navigation Handlers
  const handleGoToLogin = () => {
    // Clear any sensitive draft data when returning to login
    setRegistrationDraft({ name: '', email: '', isEmailVerified: false });
    setCurrentScreen(SCREEN_STATES.LOGIN);
  };

  const handleLoginSuccess = (userData) => {
    if (userData) {
      setCurrentUser((prev) => ({
        ...prev,
        ...userData,
      }));
    }
    setCurrentScreen(SCREEN_STATES.DASHBOARD);
  };

  const handleGoToRegister = () => {
    setCurrentScreen(SCREEN_STATES.REGISTER_PERSONAL);
  };

  const handleGoToForgotPassword = () => {
    setCurrentScreen(SCREEN_STATES.PASSWORD_RESET);
  };

  // Step 1 -> Step 2
  const handlePersonalDetailsComplete = ({ name, email }) => {
    setRegistrationDraft((prev) => ({
      ...prev,
      name,
      email,
      isEmailVerified: false,
    }));
    setCurrentScreen(SCREEN_STATES.REGISTER_OTP);
  };

  // Step 2 Back -> Step 1
  const handleOtpBack = () => {
    setCurrentScreen(SCREEN_STATES.REGISTER_PERSONAL);
  };

  // Step 2 -> Step 3
  const handleOtpVerified = () => {
    setRegistrationDraft((prev) => ({
      ...prev,
      isEmailVerified: true,
    }));
    setCurrentScreen(SCREEN_STATES.REGISTER_PASSWORD);
  };

  // Step 3 Back -> Step 2
  const handlePasswordBack = () => {
    setCurrentScreen(SCREEN_STATES.REGISTER_OTP);
  };

  // Step 3 -> Success
  const handleRegistrationComplete = ({ name, email }) => {
    setRegisteredUser({ name, email });
    // Reset registration draft completely
    setRegistrationDraft({ name: '', email: '', isEmailVerified: false });
    setCurrentScreen(SCREEN_STATES.REGISTER_SUCCESS);
  };

  const handleRegisterToDashboard = () => {
    if (registeredUser) {
      const initials = registeredUser.name
        ? registeredUser.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
        : 'AC';

      setCurrentUser((prev) => ({
        ...prev,
        name: registeredUser.name,
        email: registeredUser.email,
        initials,
      }));
    }
    setCurrentScreen(SCREEN_STATES.DASHBOARD);
  };

  // If in Splash intro screen, render full-screen brand animation
  if (currentScreen === SCREEN_STATES.SPLASH) {
    return (
      <View style={styles.flexOne}>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        <SplashScreen onFinish={() => setCurrentScreen(SCREEN_STATES.LOGIN)} />
      </View>
    );
  }

  // If in Dashboard, render the tabbed main app container with fixed bottom navigation bar
  if (currentScreen === SCREEN_STATES.DASHBOARD) {
    return (
      <View style={styles.flexOne}>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        <MainAppContainer
          user={currentUser}
          onLogOut={handleGoToLogin}
        />
      </View>
    );
  }

  // Render the current active authentication screen
  const renderScreen = () => {
    switch (currentScreen) {
      case SCREEN_STATES.LOGIN:
        return (
          <LoginScreen
            onNavigateToRegister={handleGoToRegister}
            onNavigateToForgotPassword={handleGoToForgotPassword}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case SCREEN_STATES.REGISTER_PERSONAL:
        return (
          <RegisterPersonalScreen
            initialData={{
              name: registrationDraft.name,
              email: registrationDraft.email,
            }}
            onContinue={handlePersonalDetailsComplete}
            onNavigateToLogin={handleGoToLogin}
          />
        );

      case SCREEN_STATES.REGISTER_OTP:
        return (
          <RegisterOtpScreen
            email={registrationDraft.email}
            onVerified={handleOtpVerified}
            onBack={handleOtpBack}
          />
        );

      case SCREEN_STATES.REGISTER_PASSWORD:
        // Security check: Guard against skipping email verification
        if (!registrationDraft.isEmailVerified) {
          return (
            <RegisterOtpScreen
              email={registrationDraft.email}
              onVerified={handleOtpVerified}
              onBack={handleOtpBack}
            />
          );
        }
        return (
          <RegisterPasswordScreen
            name={registrationDraft.name}
            email={registrationDraft.email}
            isEmailVerified={registrationDraft.isEmailVerified}
            onComplete={handleRegistrationComplete}
            onBack={handlePasswordBack}
          />
        );

      case SCREEN_STATES.REGISTER_SUCCESS:
        return (
          <RegisterSuccessScreen
            registeredUser={registeredUser}
            onNavigateToLogin={handleGoToLogin}
            onNavigateToDashboard={handleRegisterToDashboard}
          />
        );

      case SCREEN_STATES.PASSWORD_RESET:
        return (
          <PasswordResetScreen
            onNavigateToLogin={handleGoToLogin}
          />
        );

      default:
        return (
          <LoginScreen
            onNavigateToRegister={handleGoToRegister}
            onNavigateToForgotPassword={handleGoToForgotPassword}
            onLoginSuccess={handleLoginSuccess}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
            {renderScreen()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  flexOne: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
});
