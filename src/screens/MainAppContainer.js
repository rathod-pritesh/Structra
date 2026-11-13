import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { COLORS } from '../constants/colors';
import {
  MOCK_USER,
  MOCK_PROJECTS,
  MOCK_TASKS,
  MOCK_INVENTORY,
  MOCK_INVENTORY_LOG,
  MOCK_ATTENDANCE,
} from '../data/mockData';

// Screens & Components
import DashboardScreen from './DashboardScreen';
import ProjectsScreen from './ProjectsScreen';
import InventoryScreen from './InventoryScreen';
import TasksScreen from './TasksScreen';
import ProfileScreen from './ProfileScreen';
import BottomNavBar from '../components/BottomNavBar';
import CreateProjectModal from '../components/CreateProjectModal';

export default function MainAppContainer({ user = MOCK_USER, onLogOut }) {
  const [activeTab, setActiveTab] = useState('home');
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [inventoryLog, setInventoryLog] = useState(MOCK_INVENTORY_LOG);
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateProject = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeductMaterial = ({ materialId, materialName, quantity, unit, project, purpose, timestamp }) => {
    // 1. Minus from stock
    setInventory((prev) =>
      prev.map((item) =>
        item.id === materialId
          ? { ...item, stock: Math.max(item.stock - quantity, 0) }
          : item
      )
    );

    // 2. Add to dispatch log
    const newLog = {
      id: `log-${Date.now()}`,
      materialName,
      quantity,
      unit,
      project,
      purpose,
      timestamp: timestamp || 'Just now',
      manager: user.name || 'Site Supervisor',
    };
    setInventoryLog((prev) => [newLog, ...prev]);
  };

  const handleToggleAttendance = (workerId) => {
    setAttendance((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? { ...w, status: w.status === 'Present' ? 'Absent' : 'Present' }
          : w
      )
    );
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardScreen
            user={user}
            projects={projects}
            tasks={tasks}
            inventory={inventory}
            onOpenCreateProject={() => setIsCreateModalOpen(true)}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        );

      case 'projects':
        return (
          <ProjectsScreen
            projects={projects}
            onOpenCreateProject={() => setIsCreateModalOpen(true)}
          />
        );

      case 'inventory':
        return (
          <InventoryScreen
            inventory={inventory}
            inventoryLog={inventoryLog}
            projects={projects}
            onDeductMaterial={handleDeductMaterial}
          />
        );

      case 'tasks':
        return (
          <TasksScreen
            tasks={tasks}
            attendance={attendance}
            onToggleTask={handleToggleTask}
            onToggleAttendance={handleToggleAttendance}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            user={user}
            onLogOut={onLogOut}
          />
        );

      default:
        return (
          <DashboardScreen
            user={user}
            projects={projects}
            tasks={tasks}
            inventory={inventory}
            onOpenCreateProject={() => setIsCreateModalOpen(true)}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenWrapper}>
        {renderActiveScreen()}
      </View>

      {/* 5-Tab Fixed Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Project creation modal */}
      <CreateProjectModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  screenWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
});
