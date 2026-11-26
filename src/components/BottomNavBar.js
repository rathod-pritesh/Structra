import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import {
  HomeIcon,
  ProjectsIcon,
  InventoryIcon,
  TasksIcon,
  AttendanceIcon,
  ProfileIcon,
} from './Icons';

const ICON_MAP = {
  home: (color) => <HomeIcon color={color} size={20} />,
  projects: (color) => <ProjectsIcon color={color} size={20} />,
  reports: (color) => <ProjectsIcon color={color} size={20} />,
  overviews: (color) => <ProjectsIcon color={color} size={20} />,
  inventory: (color) => <InventoryIcon color={color} size={20} />,
  tasks: (color) => <TasksIcon color={color} size={20} />,
  approvals: (color) => <TasksIcon color={color} size={20} />,
  attendance: (color) => <AttendanceIcon color={color} size={20} />,
  payroll: (color) => <AttendanceIcon color={color} size={20} />,
  profile: (color) => <ProfileIcon color={color} size={20} />,
};

const DEFAULT_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'profile', label: 'Profile' },
];

export default function BottomNavBar({
  activeTab = 'home',
  tabs = DEFAULT_TABS,
  onTabChange,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.innerBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const color = isActive ? COLORS.primary : COLORS.textSecondary;
          const renderIcon = ICON_MAP[tab.iconKey || tab.id] || ICON_MAP.home;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={styles.tabButton}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tab`}
            >
              {isActive && <View style={styles.activeIndicator} />}

              <View style={styles.iconContainer}>{renderIcon(color)}</View>

              <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  innerBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 4 : 2,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 6,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  iconContainer: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
