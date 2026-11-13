import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { STRUCTRA_LOGO_URI } from '../constants/structraLogo';
import SummaryCard from '../components/SummaryCard';
import ProjectCard from '../components/ProjectCard';
import { PlusIcon, TasksIcon, ChecklistIcon, InventoryIcon } from '../components/Icons';

export default function DashboardScreen({
  user = {},
  projects = [],
  tasks = [],
  inventory = [],
  onOpenCreateProject,
  onNavigateToTab,
  onSelectProject,
}) {
  const activeProjectsCount = projects.filter(
    (p) => p.status !== 'Completed'
  ).length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const urgentTasks = tasks.filter((t) => !t.completed).slice(0, 2);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Brand Bar & Profile Header */}
      <View style={styles.topBrandBar}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Image
              source={{ uri: STRUCTRA_LOGO_URI }}
              style={styles.headerLogoImage}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.headerBrandTitle}>STRUCTRA</Text>
            <Text style={styles.headerTagline}>BUILD • MANAGE • GROW</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onNavigateToTab('profile')}
          style={styles.avatarButton}
          accessibilityRole="button"
          accessibilityLabel="Open user profile"
          activeOpacity={0.8}
        >
          <Text style={styles.avatarInitials}>
            {user.initials || 'AC'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Greeting Banner */}
      <View style={styles.welcomeCard}>
        <Text style={styles.greetingText}>AHMEDABAD SITE SUPERVISOR PORTAL</Text>
        <Text style={styles.userName}>{user.name || 'Aarav Patel'}</Text>
        <Text style={styles.userRole}>
          {user.role || 'Chief Project Director'} • {user.company || 'Structra Infra Gujarat'}
        </Text>
      </View>

      {/* 2. Summary Cards for Active Projects, Pending Tasks, Completed Tasks */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Operations Overview</Text>
        <Text style={styles.sectionSubtitle}>Live field metrics</Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard
          title="Active Projects"
          value={activeProjectsCount}
          subtext="On Track"
          variant="primary"
          style={styles.summaryCol3}
        />
        <SummaryCard
          title="Pending Tasks"
          value={pendingTasksCount}
          subtext="5 Urgent"
          variant="accent"
          style={styles.summaryCol3}
        />
        <SummaryCard
          title="Completed"
          value={completedTasksCount}
          subtext="92% Rate"
          variant="success"
          style={styles.summaryCol3}
        />
      </View>

      {/* 3. Quick-Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={onOpenCreateProject}
          style={styles.primaryActionBtn}
          accessibilityRole="button"
          accessibilityLabel="Create Project"
          activeOpacity={0.85}
        >
          <View style={styles.actionIconCirclePrimary}>
            <PlusIcon color={COLORS.background} size={16} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.primaryActionTitle}>Create Project</Text>
            <Text style={styles.primaryActionSub}>New site setup</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigateToTab('tasks')}
          style={styles.secondaryActionBtn}
          accessibilityRole="button"
          accessibilityLabel="View Tasks"
          activeOpacity={0.85}
        >
          <View style={styles.actionIconCircleAccent}>
            <ChecklistIcon color={COLORS.secondary} size={16} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.secondaryActionTitle}>View Tasks</Text>
            <Text style={styles.secondaryActionSub}>{pendingTasksCount} pending</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Inventory & Stock Quick Bar */}
      <TouchableOpacity
        onPress={() => onNavigateToTab('inventory')}
        style={styles.inventoryQuickCard}
        activeOpacity={0.85}
      >
        <View style={styles.inventoryQuickLeft}>
          <View style={styles.inventoryIconBox}>
            <InventoryIcon color={COLORS.primary} size={18} />
          </View>
          <View>
            <Text style={styles.inventoryQuickTitle}>Site Inventory & Stock</Text>
            <Text style={styles.inventoryQuickSub}>
              {inventory.length > 0
                ? `${inventory.length} Tracked Items • Tap to deduct material`
                : 'No items yet • Ready for backend sync'}
            </Text>
          </View>
        </View>
        <Text style={styles.inventoryQuickArrow}>→</Text>
      </TouchableOpacity>

      {/* 4. Recent Projects Section */}
      <View style={styles.projectsHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <Text style={styles.sectionSubtitle}>Active construction sites</Text>
        </View>

        <TouchableOpacity
          onPress={() => onNavigateToTab('projects')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.seeAllText}>See All ({projects.length}) →</Text>
        </TouchableOpacity>
      </View>

      {projects.slice(0, 3).map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onPress={() => onSelectProject ? onSelectProject(project) : onNavigateToTab('projects')}
        />
      ))}

      {/* 5. Priority Tasks Preview */}
      <View style={styles.tasksSectionWrapper}>
        <View style={styles.projectsHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Urgent Site Tasks</Text>
            <Text style={styles.sectionSubtitle}>Immediate attention required</Text>
          </View>

          <TouchableOpacity
            onPress={() => onNavigateToTab('tasks')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.seeAllText}>All Tasks →</Text>
          </TouchableOpacity>
        </View>

        {urgentTasks.map((task) => (
          <Pressable
            key={task.id}
            onPress={() => onNavigateToTab('tasks')}
            style={styles.taskCard}
          >
            <View style={styles.taskBadgeCol}>
              <View style={styles.priorityPill}>
                <Text style={styles.priorityText}>{task.priority}</Text>
              </View>
            </View>

            <View style={styles.taskInfoCol}>
              <Text style={styles.taskTitle} numberOfLines={1}>
                {task.title}
              </Text>
              <Text style={styles.taskSubtext}>
                {task.project} • {task.dueDate}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  topBrandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: COLORS.card,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    marginRight: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLogoImage: {
    width: '100%',
    height: '100%',
  },
  headerBrandTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    color: COLORS.primary,
  },
  headerTagline: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.secondary,
  },
  welcomeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  greetingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  userRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E6E4DD',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarInitials: {
    color: COLORS.background,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  summaryCol3: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIconCirclePrimary: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(250, 248, 243, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  primaryActionTitle: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryActionSub: {
    color: 'rgba(250, 248, 243, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#E2DFD2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconCircleAccent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(200, 117, 86, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  secondaryActionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryActionSub: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  inventoryQuickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    marginTop: -8,
  },
  inventoryQuickLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inventoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.navyLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inventoryQuickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  inventoryQuickSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  inventoryQuickArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 8,
  },
  actionTextContainer: {
    flex: 1,
  },
  projectsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tasksSectionWrapper: {
    marginTop: 8,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  taskBadgeCol: {
    marginRight: 12,
  },
  priorityPill: {
    backgroundColor: 'rgba(200, 117, 86, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondary,
    textTransform: 'uppercase',
  },
  taskInfoCol: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  taskSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
