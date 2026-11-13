import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { AttendanceIcon } from '../components/Icons';

export default function TasksScreen({
  tasks = [],
  attendance = [],
  onToggleTask,
  onToggleAttendance,
}) {
  const [subTab, setSubTab] = useState('tasks'); // 'tasks' | 'attendance'
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = ['All', 'Pending', 'Completed'];

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'Pending') return !task.completed;
    if (activeFilter === 'Completed') return task.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenTitle}>
            {subTab === 'tasks' ? 'Site Operations' : 'Workforce & Labor'}
          </Text>
          <Text style={styles.screenSubtitle}>
            {subTab === 'tasks'
              ? `${pendingCount} Pending QA & Site Inspections`
              : 'Daily Labor Attendance & Site Roster'}
          </Text>
        </View>
      </View>

      {/* Main Sub-Tab Switcher: Site Tasks vs Attendance */}
      <View style={styles.subTabSwitcherContainer}>
        <TouchableOpacity
          onPress={() => setSubTab('tasks')}
          style={[
            styles.subTabButton,
            subTab === 'tasks' && styles.subTabButtonActive,
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: subTab === 'tasks' }}
        >
          <Text
            style={[
              styles.subTabText,
              subTab === 'tasks' && styles.subTabTextActive,
            ]}
          >
            Site Tasks ({tasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSubTab('attendance')}
          style={[
            styles.subTabButton,
            subTab === 'attendance' && styles.subTabButtonActive,
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: subTab === 'attendance' }}
        >
          <Text
            style={[
              styles.subTabText,
              subTab === 'attendance' && styles.subTabTextActive,
            ]}
          >
            Crew Attendance ({attendance.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. TASKS SUB-TAB VIEW */}
      {subTab === 'tasks' && (
        <>
          {/* Filter Tabs */}
          <View style={styles.filterRow}>
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveFilter(tab)}
                  style={[
                    styles.filterTab,
                    isActive && styles.filterTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      isActive && styles.filterTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Task List / Empty State */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredTasks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Tasks Found</Text>
                <Text style={styles.emptySubtitle}>
                  Site tasks assigned to this project will appear here once connected to the backend.
                </Text>
              </View>
            ) : (
              filteredTasks.map((task) => {
                const isHigh = task.priority === 'High';
                const isDone = task.completed;

                return (
                  <Pressable
                    key={task.id}
                    onPress={() => onToggleTask && onToggleTask(task.id)}
                    style={[
                      styles.taskCard,
                      isDone && styles.taskCardCompleted,
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isDone }}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isDone && styles.checkboxChecked,
                      ]}
                    >
                      {isDone && <Text style={styles.checkMark}>✓</Text>}
                    </View>

                    <View style={styles.taskBody}>
                      <View style={styles.taskMetaRow}>
                        <View
                          style={[
                            styles.priorityBadge,
                            isHigh ? styles.priorityHigh : styles.priorityNormal,
                          ]}
                        >
                          <Text
                            style={[
                              styles.priorityText,
                              isHigh
                                ? styles.priorityTextHigh
                                : styles.priorityTextNormal,
                            ]}
                          >
                            {task.priority} Priority
                          </Text>
                        </View>
                        <Text style={styles.dueDateText}>{task.dueDate}</Text>
                      </View>

                      <Text
                        style={[
                          styles.taskTitle,
                          isDone && styles.taskTitleCompleted,
                        ]}
                      >
                        {task.title}
                      </Text>
                      <Text style={styles.projectText}>{task.project}</Text>
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </>
      )}

      {/* 2. ATTENDANCE SUB-TAB VIEW */}
      {subTab === 'attendance' && (
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Attendance Metric Bar */}
          <View style={styles.attendanceSummaryRow}>
            <View style={styles.attMetricCard}>
              <Text style={styles.attMetricValue}>{attendance.length}</Text>
              <Text style={styles.attMetricLabel}>Enrolled Crew</Text>
            </View>
            <View style={styles.attMetricCard}>
              <Text style={[styles.attMetricValue, { color: COLORS.success }]}>
                {presentCount}
              </Text>
              <Text style={styles.attMetricLabel}>Present On Site</Text>
            </View>
            <View style={styles.attMetricCard}>
              <Text style={[styles.attMetricValue, { color: COLORS.error }]}>
                {absentCount}
              </Text>
              <Text style={styles.attMetricLabel}>Absent</Text>
            </View>
          </View>

          {/* Attendance Records List / Clean Empty State */}
          {attendance.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <AttendanceIcon color={COLORS.secondary} size={30} />
              </View>
              <Text style={styles.emptyTitle}>No Attendance Records Yet</Text>
              <Text style={styles.emptySubtitle}>
                Daily workforce attendance records will sync here from site biometric scanners or check-in stations once connected to the backend.
              </Text>
            </View>
          ) : (
            attendance.map((worker) => {
              const isPresent = worker.status === 'Present';

              return (
                <View key={worker.id} style={styles.workerCard}>
                  <View style={styles.workerInfoCol}>
                    <Text style={styles.workerName}>{worker.name}</Text>
                    <Text style={styles.workerTrade}>
                      {worker.trade} • {worker.crew}
                    </Text>
                    <Text style={styles.workerShift}>
                      {worker.shift} {worker.checkIn ? `• In: ${worker.checkIn}` : ''}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      onToggleAttendance && onToggleAttendance(worker.id)
                    }
                    style={[
                      styles.attendanceToggleBtn,
                      isPresent
                        ? styles.btnStatusPresent
                        : styles.btnStatusAbsent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.attendanceToggleText,
                        isPresent
                          ? styles.textStatusPresent
                          : styles.textStatusAbsent,
                      ]}
                    >
                      {isPresent ? 'Present ✓' : 'Absent ✕'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  subTabSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 12,
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  subTabTextActive: {
    color: COLORS.background,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.background,
  },
  scrollList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingVertical: 36,
    paddingHorizontal: 24,
    marginVertical: 10,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.amberLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 10,
  },
  taskCardCompleted: {
    backgroundColor: '#F7F6F2',
    borderColor: '#E2E0D5',
    opacity: 0.8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkMark: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '800',
  },
  taskBody: {
    flex: 1,
  },
  taskMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  priorityHigh: {
    backgroundColor: COLORS.amberLight,
  },
  priorityNormal: {
    backgroundColor: '#EAF0F8',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priorityTextHigh: {
    color: COLORS.secondary,
  },
  priorityTextNormal: {
    color: COLORS.textSecondary,
  },
  dueDateText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 19,
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  projectText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  attendanceSummaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  attMetricCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingVertical: 12,
    alignItems: 'center',
  },
  attMetricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  attMetricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  workerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 10,
  },
  workerInfoCol: {
    flex: 1,
    paddingRight: 10,
  },
  workerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  workerTrade: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  workerShift: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  attendanceToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  btnStatusPresent: {
    backgroundColor: COLORS.successLight,
    borderColor: '#C7E4D3',
  },
  btnStatusAbsent: {
    backgroundColor: COLORS.errorLight,
    borderColor: '#F5C6CB',
  },
  attendanceToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textStatusPresent: {
    color: COLORS.success,
  },
  textStatusAbsent: {
    color: COLORS.error,
  },
});
