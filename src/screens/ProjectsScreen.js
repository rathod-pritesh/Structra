import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { COLORS } from '../constants/colors';
import ProjectCard from '../components/ProjectCard';
import { PlusIcon } from '../components/Icons';
import SubmitReportModal from '../components/SubmitReportModal';
import PrimaryButton from '../components/PrimaryButton';

export default function ProjectsScreen({
  userRole = 'Supervisor',
  lockedSubTab = null,
  lockedReportStage = null,
  projects = [],
  reports = [],
  adminOverviews = [],
  onOpenCreateProject,
  onSubmitReport,
  onSendOverviewToAdmin,
  onApproveAdminOverview,
}) {
  const [subTab, setSubTab] = useState(lockedSubTab || 'projects'); // 'projects' | 'reports'
  const activeSubTab = lockedSubTab || subTab;
  const initialReportStage =
    lockedReportStage ||
    (userRole === 'Admin'
      ? 'admin'
      : userRole === 'Site / Project Manager'
      ? 'manager'
      : 'field');
  const [reportStage, setReportStage] = useState(initialReportStage); // 'field' | 'manager' | 'admin'
  const activeReportStage = lockedReportStage || reportStage;

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitReportOpen, setIsSubmitReportOpen] = useState(false);
  const [overviewNote, setOverviewNote] = useState('');

  const filterTabs = ['All', 'In Progress', 'On Schedule', 'Near Completion'];

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      activeFilter === 'All' || project.status === activeFilter;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingManagerReports = reports.filter(
    (r) => r.status === 'Submitted to Manager'
  );
  const pendingAdminOverviews = adminOverviews.filter(
    (o) => o.status === 'Pending Admin Review'
  ).length;

  const getReportBadge = (status) => {
    if (status === 'Admin Approved') {
      return { bg: COLORS.successLight, text: COLORS.success, label: 'Admin Approved ✓' };
    }
    if (status === 'In Admin Overview') {
      return {
        bg: COLORS.navyLight || '#EEF2F8',
        text: COLORS.primary,
        label: 'Sent to Admin',
      };
    }
    return {
      bg: COLORS.amberLight || '#FDF1E8',
      text: COLORS.secondary,
      label: 'With Manager',
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenTitle}>
            {activeSubTab === 'projects'
              ? 'Project Portfolio'
              : activeReportStage === 'admin'
              ? 'Admin Overviews'
              : 'Site Reports'}
          </Text>
          <Text style={styles.screenSubtitle}>
            {activeSubTab === 'projects'
              ? `${projects.length} Total Construction Sites`
              : activeReportStage === 'admin'
              ? 'Executive Project Overviews from Managers'
              : 'PDF & Excel Reports → Manager → Admin Overview'}
          </Text>
        </View>

        {activeSubTab === 'projects' &&
        userRole === 'Site / Project Manager' ? (
          <TouchableOpacity
            onPress={onOpenCreateProject}
            style={styles.newProjectBtn}
            accessibilityRole="button"
            accessibilityLabel="Add new project"
          >
            <PlusIcon color={COLORS.background} size={14} />
            <Text style={styles.newProjectText}>New</Text>
          </TouchableOpacity>
        ) : activeSubTab === 'reports' && activeReportStage === 'field' ? (
          <TouchableOpacity
            onPress={() => setIsSubmitReportOpen(true)}
            style={styles.submitReportBtn}
          >
            <PlusIcon color="#FFFFFF" size={14} />
            <Text style={styles.newProjectText}>Report</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {!lockedSubTab && (
        <View style={styles.subTabSwitcher}>
          <TouchableOpacity
            onPress={() => setSubTab('projects')}
            style={[
              styles.subTabBtn,
              activeSubTab === 'projects' && styles.subTabBtnActive,
            ]}
          >
            <Text
              style={[
                styles.subTabText,
                activeSubTab === 'projects' && styles.subTabTextActive,
              ]}
            >
              Sites ({projects.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSubTab('reports')}
            style={[
              styles.subTabBtn,
              activeSubTab === 'reports' && styles.subTabBtnActive,
            ]}
          >
            <Text
              style={[
                styles.subTabText,
                activeSubTab === 'reports' && styles.subTabTextActive,
              ]}
            >
              Site Reports ({reports.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {activeSubTab === 'projects' && (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search projects, locations, phases..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveFilter(tab)}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
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
            </ScrollView>
          </View>

          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredProjects.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No matching projects found</Text>
                <Text style={styles.emptySubtitle}>
                  Tap '+ New' above to create a project or adjust your search filter.
                </Text>
              </View>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </ScrollView>
        </>
      )}

      {activeSubTab === 'reports' && (
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {!lockedReportStage && (
            <View style={styles.stageRow}>
              <TouchableOpacity
                onPress={() => setReportStage('field')}
                style={[
                  styles.stagePill,
                  activeReportStage === 'field' && styles.stagePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.stagePillText,
                    activeReportStage === 'field' && styles.stagePillTextActive,
                  ]}
                >
                  1. Field Submit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setReportStage('manager')}
                style={[
                  styles.stagePill,
                  activeReportStage === 'manager' && styles.stagePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.stagePillText,
                    activeReportStage === 'manager' && styles.stagePillTextActive,
                  ]}
                >
                  2. Manager ({pendingManagerReports.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setReportStage('admin')}
                style={[
                  styles.stagePill,
                  activeReportStage === 'admin' && styles.stagePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.stagePillText,
                    activeReportStage === 'admin' && styles.stagePillTextActive,
                  ]}
                >
                  3. Admin ({pendingAdminOverviews})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeReportStage === 'field' && (
            <>
              {reports.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Reports Submitted Yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Engineers & Supervisors can tap '+ Report' above to submit PDF or Excel progress/QA reports to the Site / Project Manager.
                  </Text>
                </View>
              ) : (
                reports.map((rep) => {
                  const badge = getReportBadge(rep.status);
                  const isPdf = rep.fileFormat === 'PDF';
                  return (
                    <View key={rep.id} style={styles.reportCard}>
                      <View style={styles.reportTopRow}>
                        <View
                          style={[
                            styles.fileBadge,
                            isPdf ? styles.fileBadgePdf : styles.fileBadgeExcel,
                          ]}
                        >
                          <Text
                            style={[
                              styles.fileBadgeText,
                              isPdf
                                ? styles.fileBadgeTextPdf
                                : styles.fileBadgeTextExcel,
                            ]}
                          >
                            {rep.fileFormat}
                          </Text>
                        </View>
                        <Text style={styles.reportTitle}>{rep.title}</Text>
                      </View>

                      <Text style={styles.reportFile}>📎 {rep.fileName}</Text>
                      <Text style={styles.reportMeta}>
                        {rep.category} • {rep.project}
                      </Text>
                      <Text style={styles.reportNotes}>{rep.notes}</Text>

                      <View style={styles.reportFooter}>
                        <Text style={styles.reportTime}>
                          {rep.submitterRole} ({rep.submittedBy}) • {rep.submittedAt}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                            {badge.label}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </>
          )}

          {activeReportStage === 'manager' && (
            <>
              <View style={styles.overviewComposerCard}>
                <Text style={styles.composerTitle}>
                  Consolidate & Send Admin Overview
                </Text>
                <Text style={styles.composerSub}>
                  {pendingManagerReports.length} field report(s) ready to bundle for Admin review
                </Text>

                <TextInput
                  style={styles.overviewInput}
                  placeholder="Executive summary / deadline status note for Admin..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={overviewNote}
                  onChangeText={setOverviewNote}
                  multiline
                />

                <PrimaryButton
                  title={`Send Overview to Admin (${pendingManagerReports.length}) →`}
                  disabled={pendingManagerReports.length === 0}
                  onPress={() => {
                    if (onSendOverviewToAdmin) {
                      onSendOverviewToAdmin(overviewNote);
                      setOverviewNote('');
                    }
                  }}
                />
              </View>

              <Text style={styles.subGroupTitle}>Collected Field Reports</Text>
              {reports.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Field Reports Yet</Text>
                  <Text style={styles.emptySubtitle}>
                    PDF and Excel reports submitted by Engineers and Supervisors will appear here.
                  </Text>
                </View>
              ) : (
                reports.map((rep) => {
                  const badge = getReportBadge(rep.status);
                  return (
                    <View key={rep.id} style={styles.reportCard}>
                      <View style={styles.reportTopRow}>
                        <Text style={styles.reportTitle}>{rep.title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                            {badge.label}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.reportFile}>
                        📎 {rep.fileName} ({rep.fileFormat})
                      </Text>
                      <Text style={styles.reportTime}>
                        From {rep.submitterRole}: {rep.submittedBy} • {rep.project}
                      </Text>
                    </View>
                  );
                })
              )}
            </>
          )}

          {activeReportStage === 'admin' && (
            <>
              {adminOverviews.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Admin Overviews Yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Once the Site / Project Manager consolidates field reports and sends an overview, it appears here for Admin sign-off.
                  </Text>
                </View>
              ) : (
                adminOverviews.map((ovr) => {
                  const isReviewed = ovr.status === 'Reviewed by Admin';
                  return (
                    <View key={ovr.id} style={styles.overviewCard}>
                      <View style={styles.reportTopRow}>
                        <View>
                          <Text style={styles.reportTitle}>
                            Overview #{ovr.id} • {ovr.date}
                          </Text>
                          <Text style={styles.reportTime}>
                            Manager: {ovr.managerName} at {ovr.submittedAt}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: isReviewed
                                ? COLORS.successLight
                                : COLORS.amberLight || '#FDF1E8',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              {
                                color: isReviewed ? COLORS.success : COLORS.secondary,
                              },
                            ]}
                          >
                            {isReviewed ? 'Reviewed ✓' : 'Pending Review'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.overviewSummaryText}>
                        {ovr.summaryNote}
                      </Text>

                      <View style={styles.attachedBox}>
                        <Text style={styles.attachedHeader}>
                          Included Reports ({ovr.reports.length}):
                        </Text>
                        {ovr.reports.map((r) => (
                          <Text key={r.id} style={styles.attachedItem}>
                            • [{r.fileFormat}] {r.title} ({r.fileName})
                          </Text>
                        ))}
                      </View>

                      {!isReviewed ? (
                        <TouchableOpacity
                          onPress={() =>
                            onApproveAdminOverview && onApproveAdminOverview(ovr.id)
                          }
                          style={styles.adminApproveBtn}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.adminApproveText}>
                            Mark Overview Reviewed ✓
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.reviewedTime}>
                          Reviewed by Admin at {ovr.reviewedAt}
                        </Text>
                      )}
                    </View>
                  );
                })
              )}
            </>
          )}
        </ScrollView>
      )}

      {/* Submit Report Modal */}
      <SubmitReportModal
        visible={isSubmitReportOpen}
        projects={projects}
        userRole={userRole}
        onClose={() => setIsSubmitReportOpen(false)}
        onSubmitReport={(rep) => onSubmitReport && onSubmitReport(rep)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  newProjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  submitReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  newProjectText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  subTabSwitcher: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 12,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  subTabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  clearSearchText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    padding: 4,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  stageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  stagePill: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  stagePillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stagePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  stagePillTextActive: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  reportCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 10,
  },
  reportTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  fileBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fileBadgePdf: {
    backgroundColor: '#FDECEA',
  },
  fileBadgeExcel: {
    backgroundColor: COLORS.successLight,
  },
  fileBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  fileBadgeTextPdf: {
    color: COLORS.error,
  },
  fileBadgeTextExcel: {
    color: COLORS.success,
  },
  reportTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reportFile: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 3,
  },
  reportMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  reportNotes: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
    paddingTop: 8,
  },
  reportTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    paddingRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  overviewComposerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 14,
    marginBottom: 14,
  },
  composerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  composerSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  overviewInput: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    minHeight: 58,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  subGroupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  overviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 12,
  },
  overviewSummaryText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 18,
  },
  attachedBox: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  attachedHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  attachedItem: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  adminApproveBtn: {
    backgroundColor: COLORS.success,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  adminApproveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reviewedTime: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
    textAlign: 'right',
  },
});
