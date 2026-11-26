import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function ApprovalsScreen({
  userRole = 'Site / Project Manager',
  materialRequests = [],
  pendingUsers = [],
  onReviewMaterialRequest,
  onReviewUserRequest,
}) {
  const isAdmin = userRole === 'Admin';

  const relevantUsers = pendingUsers.filter((u) =>
    isAdmin
      ? u.approver === 'Admin'
      : u.approver !== 'Admin'
  );

  const pendingUserCount = relevantUsers.filter((u) => u.status === 'Pending').length;
  const pendingMatCount = materialRequests.filter(
    (r) => r.status === 'Pending Manager Approval'
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenTitle}>
            {isAdmin ? 'Admin Approvals' : 'Manager Approvals'}
          </Text>
          <Text style={styles.screenSubtitle}>
            {isAdmin
              ? 'Approve Site / Project Manager account requests'
              : 'Approve Supervisor material requests & field signups'}
          </Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>
            {isAdmin ? 'ADMIN' : 'MANAGER'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {!isAdmin && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Material Requisitions ({pendingMatCount} Pending)
              </Text>
            </View>

            {materialRequests.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No Material Requests Yet</Text>
                <Text style={styles.emptySub}>
                  Material requests submitted by Supervisors will appear here for approval before Store Keeper dispatch.
                </Text>
              </View>
            ) : (
              materialRequests.map((req) => {
                const isPending = req.status === 'Pending Manager Approval';
                const isApproved = req.status !== 'Pending Manager Approval' && req.status !== 'Rejected';
                return (
                  <View key={req.id} style={styles.card}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTitle}>
                        {req.materialName} • {req.quantity} {req.unit}
                      </Text>
                      <View
                        style={[
                          styles.badge,
                          isPending
                            ? styles.badgePending
                            : isApproved
                            ? styles.badgeApproved
                            : styles.badgeRejected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            isPending
                              ? styles.badgeTextPending
                              : isApproved
                              ? styles.badgeTextApproved
                              : styles.badgeTextRejected,
                          ]}
                        >
                          {isPending
                            ? 'Pending'
                            : isApproved
                            ? 'Approved ✓'
                            : 'Rejected ✕'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.cardMeta}>
                      {req.project} • {req.purpose}
                    </Text>
                    <Text style={styles.cardTime}>
                      Requested by {req.requestedBy} at {req.requestedAt}
                    </Text>

                    {isPending ? (
                      <View style={styles.actionRow}>
                        <TouchableOpacity
                          onPress={() =>
                            onReviewMaterialRequest &&
                            onReviewMaterialRequest(req.id, 'reject')
                          }
                          style={styles.rejectBtn}
                        >
                          <Text style={styles.rejectText}>Reject ✕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            onReviewMaterialRequest &&
                            onReviewMaterialRequest(req.id, 'approve')
                          }
                          style={styles.approveBtn}
                        >
                          <Text style={styles.approveText}>Approve ✓</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                );
              })
            )}
          </View>
        )}

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {isAdmin
                ? `Manager Signup Requests (${pendingUserCount} Pending)`
                : `Team Signup Requests (${pendingUserCount} Pending)`}
            </Text>
          </View>

          {relevantUsers.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No Pending Account Requests</Text>
              <Text style={styles.emptySub}>
                {isAdmin
                  ? 'New Site / Project Manager registrations will appear here for Admin activation.'
                  : 'New Supervisor, Engineer, Store Keeper, and Accounts registrations will appear here for approval.'}
              </Text>
            </View>
          ) : (
            relevantUsers.map((usr) => {
              const isPending = usr.status === 'Pending';
              const isApproved = usr.status === 'Approved';
              return (
                <View key={usr.id} style={styles.card}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle}>{usr.name}</Text>
                    <View
                      style={[
                        styles.badge,
                        isPending
                          ? styles.badgePending
                          : isApproved
                          ? styles.badgeApproved
                          : styles.badgeRejected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          isPending
                            ? styles.badgeTextPending
                            : isApproved
                            ? styles.badgeTextApproved
                            : styles.badgeTextRejected,
                        ]}
                      >
                        {isPending
                          ? 'Pending'
                          : isApproved
                          ? 'Approved ✓'
                          : 'Rejected ✕'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardMeta}>
                    Role: {usr.roleLabel} • {usr.email}
                  </Text>
                  <Text style={styles.cardTime}>
                    Requested at {usr.requestedAt}
                  </Text>

                  {isPending ? (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        onPress={() =>
                          onReviewUserRequest &&
                          onReviewUserRequest(usr.id, 'reject')
                        }
                        style={styles.rejectBtn}
                      >
                        <Text style={styles.rejectText}>Reject ✕</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          onReviewUserRequest &&
                          onReviewUserRequest(usr.id, 'approve')
                        }
                        style={styles.approveBtn}
                      >
                        <Text style={styles.approveText}>Approve Account ✓</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 12,
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
  roleBadge: {
    backgroundColor: COLORS.navyLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.7,
  },
  scrollList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePending: {
    backgroundColor: COLORS.amberLight || '#FDF1E8',
  },
  badgeApproved: {
    backgroundColor: COLORS.successLight,
  },
  badgeRejected: {
    backgroundColor: COLORS.errorLight || '#FDECEA',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  badgeTextPending: {
    color: COLORS.secondary,
  },
  badgeTextApproved: {
    color: COLORS.success,
  },
  badgeTextRejected: {
    color: COLORS.error,
  },
  cardMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  cardTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  rejectBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight || '#FDECEA',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  rejectText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '700',
  },
  approveBtn: {
    flex: 1,
    backgroundColor: COLORS.success,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
