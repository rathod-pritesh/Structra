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
import { AttendanceIcon, PlusIcon } from '../components/Icons';
import AddWorkerModal from '../components/AddWorkerModal';
import PrimaryButton from '../components/PrimaryButton';

export default function TasksScreen({
  userRole = 'Supervisor',
  lockedSubTab = null,
  lockedAttStage = null,
  tasks = [],
  attendance = [],
  payrollBatches = [],
  onToggleTask,
  onToggleAttendance,
  onAddWorker,
  onSubmitAttendance,
  onReleasePayroll,
}) {
  const [subTab, setSubTab] = useState(lockedSubTab || 'tasks'); // 'tasks' | 'attendance'
  const activeSubTab = lockedSubTab || subTab;
  const [attStage, setAttStage] = useState(
    lockedAttStage || (userRole === 'Accounts Dept.' ? 'accounts' : 'supervisor')
  ); // 'supervisor' | 'accounts'
  const activeAttStage = lockedAttStage || attStage;
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const filterTabs = ['All', 'Pending', 'Completed'];

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'Pending') return !task.completed;
    if (activeFilter === 'Completed') return task.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const halfDayCount = attendance.filter((a) => a.status === 'Half-Day').length;
  const estimatedWageTotal = attendance.reduce((sum, w) => {
    const mult = w.status === 'Present' ? 1 : w.status === 'Half-Day' ? 0.5 : 0;
    return sum + Math.round((w.dailyWage || 0) * mult);
  }, 0);

  const pendingPayoutBatches = payrollBatches.filter(
    (b) => b.status === 'Pending Payout'
  ).length;
  const totalReleasedAmount = payrollBatches
    .filter((b) => b.status === 'Payment Released')
    .reduce((sum, b) => sum + (b.totalPayable || 0), 0);

  const handleConfirmSubmitAttendance = () => {
    if (onSubmitAttendance) {
      onSubmitAttendance();
      setSubmittedNotice(true);
      setTimeout(() => setSubmittedNotice(false), 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenTitle}>
            {activeSubTab === 'tasks'
              ? 'Site Operations'
              : activeAttStage === 'accounts'
              ? 'Labour Payroll'
              : 'Crew Attendance'}
          </Text>
          <Text style={styles.screenSubtitle}>
            {activeSubTab === 'tasks'
              ? `${pendingCount} Pending QA & Site Inspections`
              : activeAttStage === 'accounts'
              ? 'Accounts Dept. — Release Labour Wages'
              : 'Supervisor — Daily Labour Attendance Roster'}
          </Text>
        </View>
      </View>

      {!lockedSubTab && (
        <View style={styles.subTabSwitcherContainer}>
          <TouchableOpacity
            onPress={() => setSubTab('tasks')}
            style={[
              styles.subTabButton,
              activeSubTab === 'tasks' && styles.subTabButtonActive,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeSubTab === 'tasks' }}
          >
            <Text
              style={[
                styles.subTabText,
                activeSubTab === 'tasks' && styles.subTabTextActive,
              ]}
            >
              Site Tasks ({tasks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSubTab('attendance')}
            style={[
              styles.subTabButton,
              activeSubTab === 'attendance' && styles.subTabButtonActive,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeSubTab === 'attendance' }}
          >
            <Text
              style={[
                styles.subTabText,
                activeSubTab === 'attendance' && styles.subTabTextActive,
              ]}
            >
              Crew Attendance ({attendance.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {activeSubTab === 'tasks' && (
        <>
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

      {activeSubTab === 'attendance' && (
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {!lockedAttStage && (
            <View style={styles.workflowPillRow}>
              <TouchableOpacity
                onPress={() => setAttStage('supervisor')}
                style={[
                  styles.workflowPill,
                  activeAttStage === 'supervisor' && styles.workflowPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.workflowPillText,
                    activeAttStage === 'supervisor' && styles.workflowPillTextActive,
                  ]}
                >
                  1. Supervisor Roster
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAttStage('accounts')}
                style={[
                  styles.workflowPill,
                  activeAttStage === 'accounts' && styles.workflowPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.workflowPillText,
                    activeAttStage === 'accounts' && styles.workflowPillTextActive,
                  ]}
                >
                  2. Accounts Dept. ({pendingPayoutBatches})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeAttStage === 'supervisor' && (
            <>
              <View style={styles.stageHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stageTitle}>Daily Labour Attendance</Text>
                  <Text style={styles.stageSub}>
                    Mark status & submit sheet to Accounts Dept.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsAddWorkerOpen(true)}
                  style={styles.addWorkerBtn}
                  activeOpacity={0.85}
                >
                  <PlusIcon color="#FFFFFF" size={14} />
                  <Text style={styles.addWorkerBtnText}>Add Worker</Text>
                </TouchableOpacity>
              </View>

              {/* Attendance Metric Bar */}
              <View style={styles.attendanceSummaryRow}>
                <View style={styles.attMetricCard}>
                  <Text style={styles.attMetricValue}>{attendance.length}</Text>
                  <Text style={styles.attMetricLabel}>Enrolled</Text>
                </View>
                <View style={styles.attMetricCard}>
                  <Text style={[styles.attMetricValue, { color: COLORS.success }]}>
                    {presentCount + halfDayCount}
                  </Text>
                  <Text style={styles.attMetricLabel}>On Site</Text>
                </View>
                <View style={styles.attMetricCard}>
                  <Text style={[styles.attMetricValue, { color: COLORS.primary }]}>
                    ₹{estimatedWageTotal}
                  </Text>
                  <Text style={styles.attMetricLabel}>Est. Wage</Text>
                </View>
              </View>

              {submittedNotice ? (
                <View style={styles.successBanner}>
                  <Text style={styles.successBannerText}>
                    Attendance sheet submitted to Accounts Dept. for wage payout!
                  </Text>
                </View>
              ) : null}

              {attendance.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconCircle}>
                    <AttendanceIcon color={COLORS.secondary} size={30} />
                  </View>
                  <Text style={styles.emptyTitle}>No Labourers Enrolled Yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Tap '+ Add Worker' to enroll daily workers, mark their attendance, and submit to the Accounts Department.
                  </Text>
                </View>
              ) : (
                <>
                  {attendance.map((worker) => {
                    const isPresent = worker.status === 'Present';
                    const isHalf = worker.status === 'Half-Day';
                    const wageToday = isPresent
                      ? worker.dailyWage
                      : isHalf
                      ? Math.round((worker.dailyWage || 0) * 0.5)
                      : 0;

                    return (
                      <View key={worker.id} style={styles.workerCard}>
                        <View style={styles.workerInfoCol}>
                          <Text style={styles.workerName}>{worker.name}</Text>
                          <Text style={styles.workerTrade}>
                            {worker.trade} • ₹{worker.dailyWage}/day
                          </Text>
                          <Text style={styles.workerShift}>
                            {worker.shift} • Payable: ₹{wageToday}
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
                              : isHalf
                              ? styles.btnStatusHalf
                              : styles.btnStatusAbsent,
                          ]}
                        >
                          <Text
                            style={[
                              styles.attendanceToggleText,
                              isPresent
                                ? styles.textStatusPresent
                                : isHalf
                                ? styles.textStatusHalf
                                : styles.textStatusAbsent,
                            ]}
                          >
                            {isPresent
                              ? 'Present ✓'
                              : isHalf
                              ? 'Half-Day'
                              : 'Absent ✕'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}

                  {/* Submit to Accounts Card */}
                  <View style={styles.submitPayrollCard}>
                    <View style={styles.submitPayrollRow}>
                      <Text style={styles.submitPayrollLabel}>
                        Today's Total Labour Wage
                      </Text>
                      <Text style={styles.submitPayrollAmount}>
                        ₹{estimatedWageTotal}
                      </Text>
                    </View>
                    <PrimaryButton
                      title="Submit Attendance to Accounts Dept. →"
                      onPress={handleConfirmSubmitAttendance}
                    />
                  </View>
                </>
              )}
            </>
          )}

          {activeAttStage === 'accounts' && (
            <>
              <View style={styles.stageHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stageTitle}>Accounts Dept. — Labour Pay</Text>
                  <Text style={styles.stageSub}>
                    Review supervisor attendance sheets & release wages.
                  </Text>
                </View>
              </View>

              <View style={styles.attendanceSummaryRow}>
                <View style={styles.attMetricCard}>
                  <Text style={styles.attMetricValue}>{payrollBatches.length}</Text>
                  <Text style={styles.attMetricLabel}>Sheets</Text>
                </View>
                <View style={styles.attMetricCard}>
                  <Text style={[styles.attMetricValue, { color: COLORS.secondary }]}>
                    {pendingPayoutBatches}
                  </Text>
                  <Text style={styles.attMetricLabel}>Pending Pay</Text>
                </View>
                <View style={styles.attMetricCard}>
                  <Text style={[styles.attMetricValue, { color: COLORS.success }]}>
                    ₹{totalReleasedAmount}
                  </Text>
                  <Text style={styles.attMetricLabel}>Released</Text>
                </View>
              </View>

              {payrollBatches.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconCircle}>
                    <AttendanceIcon color={COLORS.primary} size={30} />
                  </View>
                  <Text style={styles.emptyTitle}>No Attendance Sheets Submitted</Text>
                  <Text style={styles.emptySubtitle}>
                    When a Supervisor marks daily attendance and submits it, the wage sheet appears here for Accounts Dept. payout release.
                  </Text>
                </View>
              ) : (
                payrollBatches.map((batch) => {
                  const isReleased = batch.status === 'Payment Released';
                  return (
                    <View key={batch.id} style={styles.payrollCard}>
                      <View style={styles.payrollHeader}>
                        <View>
                          <Text style={styles.payrollId}>
                            Sheet #{batch.id} • {batch.date}
                          </Text>
                          <Text style={styles.payrollMeta}>
                            By {batch.submittedBy} at {batch.submittedAt}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.payrollBadge,
                            isReleased
                              ? styles.payrollBadgeReleased
                              : styles.payrollBadgePending,
                          ]}
                        >
                          <Text
                            style={[
                              styles.payrollBadgeText,
                              isReleased
                                ? styles.payrollBadgeTextReleased
                                : styles.payrollBadgeTextPending,
                            ]}
                          >
                            {isReleased ? 'Released ✓' : 'Pending Payout'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.payrollCountsRow}>
                        <Text style={styles.payrollCountChip}>
                          Present: {batch.presentCount}
                        </Text>
                        <Text style={styles.payrollCountChip}>
                          Half-Day: {batch.halfDayCount}
                        </Text>
                        <Text style={styles.payrollCountChip}>
                          Absent: {batch.absentCount}
                        </Text>
                      </View>

                      {/* Worker Wage Breakdown */}
                      <View style={styles.entriesBox}>
                        {batch.entries.map((entry) => (
                          <View key={entry.id} style={styles.entryRow}>
                            <Text style={styles.entryName}>
                              {entry.name} ({entry.trade})
                            </Text>
                            <Text style={styles.entryWage}>
                              {entry.status} • ₹{entry.wage}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.payrollFooter}>
                        <View>
                          <Text style={styles.payrollTotalLabel}>Total Wage</Text>
                          <Text style={styles.payrollTotalValue}>
                            ₹{batch.totalPayable}
                          </Text>
                        </View>

                        {!isReleased ? (
                          <TouchableOpacity
                            onPress={() =>
                              onReleasePayroll && onReleasePayroll(batch.id)
                            }
                            style={styles.releaseBtn}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.releaseBtnText}>
                              Release Payment ✓
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Text style={styles.releasedTime}>
                            Paid at {batch.releasedAt}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </>
          )}
        </ScrollView>
      )}

      {/* Enroll Worker Modal */}
      <AddWorkerModal
        visible={isAddWorkerOpen}
        onClose={() => setIsAddWorkerOpen(false)}
        onAddWorker={(w) => onAddWorker && onAddWorker(w)}
      />
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
  textStatusHalf: {
    color: COLORS.secondary,
  },
  textStatusAbsent: {
    color: COLORS.error,
  },
  btnStatusHalf: {
    backgroundColor: COLORS.amberLight || '#FDF1E8',
    borderColor: '#F2D3BE',
  },
  workflowPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  workflowPill: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  workflowPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  workflowPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  workflowPillTextActive: {
    color: '#FFFFFF',
  },
  stageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stageTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  stageSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addWorkerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
  },
  addWorkerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  successBanner: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: '#C7E4D3',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  successBannerText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '700',
    textAlign: 'center',
  },
  submitPayrollCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 14,
    marginTop: 6,
    marginBottom: 20,
  },
  submitPayrollRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitPayrollLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  submitPayrollAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  payrollCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 12,
  },
  payrollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  payrollId: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  payrollMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  payrollBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payrollBadgePending: {
    backgroundColor: 'rgba(234, 106, 32, 0.14)',
  },
  payrollBadgeReleased: {
    backgroundColor: COLORS.successLight,
  },
  payrollBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  payrollBadgeTextPending: {
    color: COLORS.secondary,
  },
  payrollBadgeTextReleased: {
    color: COLORS.success,
  },
  payrollCountsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  payrollCountChip: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  entriesBox: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  entryWage: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  payrollFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
    paddingTop: 10,
  },
  payrollTotalLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  payrollTotalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  releaseBtn: {
    backgroundColor: COLORS.success,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  releaseBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  releasedTime: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
  },
});
