import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import { HomeIcon, ProjectsIcon, InventoryIcon, TasksIcon, ProfileIcon } from './Icons';

export default function BottomNavBar({ activeTab = 'home', onTabChange }) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (color) => <HomeIcon color={color} size={20} />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: (color) => <ProjectsIcon color={color} size={20} />,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: (color) => <InventoryIcon color={color} size={20} />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: (color) => <TasksIcon color={color} size={20} />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (color) => <ProfileIcon color={color} size={20} />,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const color = isActive ? COLORS.primary : COLORS.textSecondary;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={styles.tabButton}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tab`}
            >
              {/* Active top line indicator */}
              {isActive && <View style={styles.activeIndicator} />}

              <View style={styles.iconContainer}>
                {tab.icon(color)}
              </View>

              <Text style={[styles.tabLabel, { color }]}>
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
