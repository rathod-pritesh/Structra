import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { MOCK_USER } from '../data/mockData';

import DashboardScreen from './DashboardScreen';
import ProjectsScreen from './ProjectsScreen';
import InventoryScreen from './InventoryScreen';
import TasksScreen from './TasksScreen';
import ApprovalsScreen from './ApprovalsScreen';
import ProfileScreen from './ProfileScreen';
import BottomNavBar from '../components/BottomNavBar';
import CreateProjectModal from '../components/CreateProjectModal';

function getTabsForRole(role) {
  switch (role) {
    case 'Supervisor':
      return [
        { id: 'home', label: 'Home' },
        { id: 'reports', label: 'Reports' },
        { id: 'inventory', label: 'Inventory' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'profile', label: 'Profile' },
      ];
    case 'Engineer':
      return [
        { id: 'home', label: 'Home' },
        { id: 'projects', label: 'Projects' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'profile', label: 'Profile' },
      ];
    case 'Site / Project Manager':
      return [
        { id: 'home', label: 'Home' },
        { id: 'projects', label: 'Projects' },
        { id: 'approvals', label: 'Approvals' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'profile', label: 'Profile' },
      ];
    case 'Store Keeper':
      return [
        { id: 'home', label: 'Home' },
        { id: 'inventory', label: 'Inventory' },
        { id: 'profile', label: 'Profile' },
      ];
    case 'Accounts Dept.':
      return [
        { id: 'home', label: 'Home' },
        { id: 'payroll', label: 'Payroll' },
        { id: 'profile', label: 'Profile' },
      ];
    case 'Admin':
      return [
        { id: 'home', label: 'Home' },
        { id: 'overviews', label: 'Overviews' },
        { id: 'approvals', label: 'Approvals' },
        { id: 'profile', label: 'Profile' },
      ];
    default:
      return [
        { id: 'home', label: 'Home' },
        { id: 'projects', label: 'Projects' },
        { id: 'inventory', label: 'Inventory' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'profile', label: 'Profile' },
      ];
  }
}

export default function MainAppContainer({
  user = MOCK_USER,
  onLogOut,
  sharedState = {},
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    projects = [],
    setProjects,
    tasks = [],
    setTasks,
    inventory = [],
    setInventory,
    inventoryLog = [],
    setInventoryLog,
    attendance = [],
    setAttendance,
    payrollBatches = [],
    setPayrollBatches,
    materialRequests = [],
    setMaterialRequests,
    reports = [],
    setReports,
    adminOverviews = [],
    setAdminOverviews,
    pendingUsers = [],
    setPendingUsers,
  } = sharedState;

  const userRole = user.role || 'Supervisor';
  const roleTabs = getTabsForRole(userRole);

  const handleCreateProject = (newProject) => {
    if (setProjects) setProjects((prev) => [newProject, ...prev]);
  };

  const handleToggleTask = (taskId) => {
    if (setTasks) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const handleDeductMaterial = ({
    materialId,
    materialName,
    quantity,
    unit,
    project,
    purpose,
    timestamp,
  }) => {
    if (setInventory) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === materialId
            ? { ...item, stock: Math.max(item.stock - quantity, 0) }
            : item
        )
      );
    }
    if (setInventoryLog) {
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
    }
  };

  const handleAddInventoryItem = (newItem) => {
    if (setInventory) setInventory((prev) => [newItem, ...prev]);
  };

  const handleSubmitMaterialRequest = (requestData) => {
    if (!setMaterialRequests) return;
    const newReq = {
      ...requestData,
      requestedBy: user.name || 'Site Supervisor',
      approvedBy: null,
      issuedBy: null,
      issuedAt: null,
    };
    setMaterialRequests((prev) => [newReq, ...prev]);
  };

  const handleReviewMaterialRequest = (reqId, decision) => {
    if (!setMaterialRequests) return;
    setMaterialRequests((prev) =>
      prev.map((req) =>
        req.id === reqId
          ? {
              ...req,
              status:
                decision === 'approve'
                  ? 'Approved — Awaiting Store Keeper'
                  : 'Rejected',
              approvedBy: user.name || 'Site / Project Manager',
            }
          : req
      )
    );
  };

  const handleIssueMaterialRequest = (reqId) => {
    const targetReq = materialRequests.find((r) => r.id === reqId);
    if (!targetReq) return;

    if (targetReq.materialId && setInventory) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === targetReq.materialId
            ? { ...item, stock: Math.max(item.stock - targetReq.quantity, 0) }
            : item
        )
      );
    }

    const nowStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (setMaterialRequests) {
      setMaterialRequests((prev) =>
        prev.map((req) =>
          req.id === reqId
            ? {
                ...req,
                status: 'Issued & Assigned',
                issuedBy: user.name || 'Store Keeper',
                issuedAt: nowStr,
              }
            : req
        )
      );
    }

    if (setInventoryLog) {
      const dispatchLog = {
        id: `log-${Date.now()}`,
        materialName: targetReq.materialName,
        quantity: targetReq.quantity,
        unit: targetReq.unit,
        project: targetReq.project,
        purpose: `${targetReq.purpose} (Assigned to ${targetReq.requestedBy})`,
        timestamp: nowStr,
        manager: targetReq.approvedBy || 'Site / Project Manager',
      };
      setInventoryLog((prev) => [dispatchLog, ...prev]);
    }
  };

  const handleAddWorker = (newWorker) => {
    if (setAttendance) setAttendance((prev) => [newWorker, ...prev]);
  };

  const handleToggleAttendance = (workerId) => {
    if (!setAttendance) return;
    setAttendance((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;
        const nextStatus =
          w.status === 'Present'
            ? 'Half-Day'
            : w.status === 'Half-Day'
            ? 'Absent'
            : 'Present';
        return { ...w, status: nextStatus };
      })
    );
  };

  const handleSubmitAttendanceToAccounts = () => {
    if (attendance.length === 0 || !setPayrollBatches) return;

    const entries = attendance.map((w) => {
      const multiplier = w.status === 'Present' ? 1 : w.status === 'Half-Day' ? 0.5 : 0;
      const wage = Math.round((w.dailyWage || 0) * multiplier);
      return {
        id: w.id,
        name: w.name,
        trade: w.trade,
        status: w.status,
        wage,
      };
    });

    const totalPayable = entries.reduce((sum, e) => sum + e.wage, 0);
    const presentCount = entries.filter((e) => e.status === 'Present').length;
    const halfDayCount = entries.filter((e) => e.status === 'Half-Day').length;
    const absentCount = entries.filter((e) => e.status === 'Absent').length;

    const newBatch = {
      id: `PAY-${String(Date.now()).slice(-5)}`,
      date: new Date().toLocaleDateString(),
      submittedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      submittedBy: user.name || 'Site Supervisor',
      presentCount,
      halfDayCount,
      absentCount,
      totalWorkers: entries.length,
      totalPayable,
      entries,
      status: 'Pending Payout',
      releasedAt: null,
    };

    setPayrollBatches((prev) => [newBatch, ...prev]);
  };

  const handleReleasePayroll = (batchId) => {
    if (!setPayrollBatches) return;
    setPayrollBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              status: 'Payment Released',
              releasedAt: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : b
      )
    );
  };

  const handleSubmitReport = (reportData) => {
    if (!setReports) return;
    const newReport = {
      ...reportData,
      submittedBy: user.name || reportData.submitterRole,
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const handleSendOverviewToAdmin = (summaryNote) => {
    const pendingReports = reports.filter(
      (r) => r.status === 'Submitted to Manager'
    );
    if (pendingReports.length === 0 || !setAdminOverviews || !setReports) return;

    const nowStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const overviewPkg = {
      id: `OVR-${String(Date.now()).slice(-5)}`,
      date: new Date().toLocaleDateString(),
      submittedAt: nowStr,
      managerName: user.name || 'Site / Project Manager',
      summaryNote:
        summaryNote?.trim() ||
        `Consolidated ${pendingReports.length} field report(s) for Admin review.`,
      projectsCount: projects.length,
      reports: pendingReports,
      status: 'Pending Admin Review',
      reviewedAt: null,
    };

    setAdminOverviews((prev) => [overviewPkg, ...prev]);
    setReports((prev) =>
      prev.map((r) =>
        r.status === 'Submitted to Manager'
          ? { ...r, status: 'In Admin Overview' }
          : r
      )
    );
  };

  const handleApproveAdminOverview = (overviewId) => {
    if (!setAdminOverviews) return;
    const target = adminOverviews.find((o) => o.id === overviewId);
    const nowStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setAdminOverviews((prev) =>
      prev.map((o) =>
        o.id === overviewId
          ? { ...o, status: 'Reviewed by Admin', reviewedAt: nowStr }
          : o
      )
    );

    if (target?.reports?.length && setReports) {
      const ids = new Set(target.reports.map((r) => r.id));
      setReports((prev) =>
        prev.map((r) =>
          ids.has(r.id) ? { ...r, status: 'Admin Approved' } : r
        )
      );
    }
  };

  const handleReviewUserRequest = (userId, decision) => {
    if (!setPendingUsers) return;
    setPendingUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: decision === 'approve' ? 'Approved' : 'Rejected' }
          : u
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
            materialRequests={materialRequests}
            attendance={attendance}
            payrollBatches={payrollBatches}
            reports={reports}
            adminOverviews={adminOverviews}
            pendingUsers={pendingUsers}
            onOpenCreateProject={() => setIsCreateModalOpen(true)}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        );

      case 'projects':
        return (
          <ProjectsScreen
            userRole={userRole}
            lockedReportStage={
              userRole === 'Site / Project Manager' ? 'manager' : 'field'
            }
            projects={projects}
            reports={reports}
            adminOverviews={adminOverviews}
            onOpenCreateProject={() => setIsCreateModalOpen(true)}
            onSubmitReport={handleSubmitReport}
            onSendOverviewToAdmin={handleSendOverviewToAdmin}
            onApproveAdminOverview={handleApproveAdminOverview}
          />
        );

      case 'reports':
        return (
          <ProjectsScreen
            userRole={userRole}
            lockedSubTab="reports"
            lockedReportStage="field"
            projects={projects}
            reports={reports}
            adminOverviews={adminOverviews}
            onOpenCreateProject={() => setIsCreateModalOpen(true)}
            onSubmitReport={handleSubmitReport}
          />
        );

      case 'overviews':
        return (
          <ProjectsScreen
            userRole={userRole}
            lockedSubTab="reports"
            lockedReportStage="admin"
            projects={projects}
            reports={reports}
            adminOverviews={adminOverviews}
            onApproveAdminOverview={handleApproveAdminOverview}
          />
        );

      case 'inventory':
        return (
          <InventoryScreen
            userRole={userRole}
            lockedStage={
              userRole === 'Store Keeper' ? 'storekeeper' : 'supervisor'
            }
            inventory={inventory}
            inventoryLog={inventoryLog}
            materialRequests={materialRequests}
            projects={projects}
            onDeductMaterial={handleDeductMaterial}
            onAddInventoryItem={handleAddInventoryItem}
            onSubmitMaterialRequest={handleSubmitMaterialRequest}
            onReviewMaterialRequest={handleReviewMaterialRequest}
            onIssueMaterialRequest={handleIssueMaterialRequest}
          />
        );

      case 'tasks':
        return (
          <TasksScreen
            userRole={userRole}
            lockedSubTab="tasks"
            tasks={tasks}
            attendance={attendance}
            payrollBatches={payrollBatches}
            onToggleTask={handleToggleTask}
          />
        );

      case 'attendance':
        return (
          <TasksScreen
            userRole={userRole}
            lockedSubTab="attendance"
            lockedAttStage="supervisor"
            tasks={tasks}
            attendance={attendance}
            payrollBatches={payrollBatches}
            onToggleAttendance={handleToggleAttendance}
            onAddWorker={handleAddWorker}
            onSubmitAttendance={handleSubmitAttendanceToAccounts}
          />
        );

      case 'payroll':
        return (
          <TasksScreen
            userRole={userRole}
            lockedSubTab="attendance"
            lockedAttStage="accounts"
            tasks={tasks}
            attendance={attendance}
            payrollBatches={payrollBatches}
            onReleasePayroll={handleReleasePayroll}
          />
        );

      case 'approvals':
        return (
          <ApprovalsScreen
            userRole={userRole}
            materialRequests={materialRequests}
            pendingUsers={pendingUsers}
            onReviewMaterialRequest={handleReviewMaterialRequest}
            onReviewUserRequest={handleReviewUserRequest}
          />
        );

      case 'profile':
        return <ProfileScreen user={user} onLogOut={onLogOut} />;

      default:
        return (
          <DashboardScreen
            user={user}
            projects={projects}
            tasks={tasks}
            inventory={inventory}
            materialRequests={materialRequests}
            attendance={attendance}
            payrollBatches={payrollBatches}
            reports={reports}
            adminOverviews={adminOverviews}
            pendingUsers={pendingUsers}
            onOpenCreateProject={() => setIsCreateModalOpen(true)}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenWrapper}>{renderActiveScreen()}</View>

      {/* Role-Specific Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        tabs={roleTabs}
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
