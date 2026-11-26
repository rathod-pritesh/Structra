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
import {
  MOCK_USER,
  MOCK_PROJECTS,
  MOCK_TASKS,
  MOCK_INVENTORY,
  MOCK_INVENTORY_LOG,
  MOCK_ATTENDANCE,
} from './src/data/mockData';

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

  const [registrationDraft, setRegistrationDraft] = useState({
    name: '',
    email: '',
    role: null,
    isEmailVerified: false,
  });

  const [registeredUser, setRegisteredUser] = useState(null);

  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [inventoryLog, setInventoryLog] = useState(MOCK_INVENTORY_LOG);
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
  const [payrollBatches, setPayrollBatches] = useState([]);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [adminOverviews, setAdminOverviews] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  const handleGoToLogin = () => {
    setRegistrationDraft({ name: '', email: '', role: null, isEmailVerified: false });
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

  const handlePersonalDetailsComplete = ({ name, email, role }) => {
    setRegistrationDraft((prev) => ({
      ...prev,
      name,
      email,
      role,
      isEmailVerified: false,
    }));
    setCurrentScreen(SCREEN_STATES.REGISTER_OTP);
  };

  const handleOtpBack = () => {
    setCurrentScreen(SCREEN_STATES.REGISTER_PERSONAL);
  };

  const handleOtpVerified = () => {
    setRegistrationDraft((prev) => ({
      ...prev,
      isEmailVerified: true,
    }));
    setCurrentScreen(SCREEN_STATES.REGISTER_PASSWORD);
  };

  const handlePasswordBack = () => {
    setCurrentScreen(SCREEN_STATES.REGISTER_OTP);
  };

  const handleRegistrationComplete = ({ name, email, role }) => {
    setRegisteredUser({ name, email, role });
    setPendingUsers((prev) => [
      {
        id: `USR-${String(Date.now()).slice(-5)}`,
        name,
        email,
        roleLabel: role?.label || 'Supervisor',
        approver: role?.approver || 'Site / Project Manager',
        status: 'Pending',
        requestedAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...prev,
    ]);
    setRegistrationDraft({ name: '', email: '', role: null, isEmailVerified: false });
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
        : 'SS';

      setCurrentUser((prev) => ({
        ...prev,
        name: registeredUser.name,
        email: registeredUser.email,
        role: registeredUser.role?.label || prev.role,
        initials,
      }));
    }
    setCurrentScreen(SCREEN_STATES.DASHBOARD);
  };

  if (currentScreen === SCREEN_STATES.SPLASH) {
    return (
      <View style={styles.flexOne}>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        <SplashScreen onFinish={() => setCurrentScreen(SCREEN_STATES.LOGIN)} />
      </View>
    );
  }

  if (currentScreen === SCREEN_STATES.DASHBOARD) {
    return (
      <View style={styles.flexOne}>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        <MainAppContainer
          user={currentUser}
          onLogOut={handleGoToLogin}
          sharedState={{
            projects,
            setProjects,
            tasks,
            setTasks,
            inventory,
            setInventory,
            inventoryLog,
            setInventoryLog,
            attendance,
            setAttendance,
            payrollBatches,
            setPayrollBatches,
            materialRequests,
            setMaterialRequests,
            reports,
            setReports,
            adminOverviews,
            setAdminOverviews,
            pendingUsers,
            setPendingUsers,
          }}
        />
      </View>
    );
  }

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
              role: registrationDraft.role,
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
            role={registrationDraft.role}
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
