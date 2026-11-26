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
import { InventoryIcon, PlusIcon } from '../components/Icons';
import DeductMaterialModal from '../components/DeductMaterialModal';
import AddInventoryModal from '../components/AddInventoryModal';
import RequestMaterialModal from '../components/RequestMaterialModal';

export default function InventoryScreen({
  userRole = 'Supervisor',
  lockedStage = null,
  inventory = [],
  inventoryLog = [],
  materialRequests = [],
  projects = [],
  onDeductMaterial,
  onAddInventoryItem,
  onSubmitMaterialRequest,
  onReviewMaterialRequest,
  onIssueMaterialRequest,
}) {
  const initialStage =
    lockedStage ||
    (userRole === 'Site / Project Manager'
      ? 'manager'
      : userRole === 'Store Keeper'
      ? 'storekeeper'
      : 'supervisor');

  const [invStage, setInvStage] = useState(initialStage); // 'supervisor' | 'manager' | 'storekeeper'
  const activeStage = lockedStage || invStage;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deductTarget, setDeductTarget] = useState(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const categories = ['All', 'Structural', 'Masonry', 'Electrical', 'Low Stock'];

  const lowStockItems = inventory.filter((item) => item.stock <= item.minBuffer);
  const healthyCount = Math.max(inventory.length - lowStockItems.length, 0);

  const pendingManagerCount = materialRequests.filter(
    (r) => r.status === 'Pending Manager Approval'
  ).length;
  const readyToIssueCount = materialRequests.filter(
    (r) => r.status === 'Approved — Awaiting Store Keeper'
  ).length;

  const filteredInventory = inventory.filter((item) => {
    let matchesCategory = true;
    if (selectedCategory === 'Low Stock') {
      matchesCategory = item.stock <= item.minBuffer;
    } else if (selectedCategory !== 'All') {
      matchesCategory = item.category === selectedCategory;
    }

    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getStatusBadgeStyle = (status) => {
    if (status === 'Issued & Assigned') {
      return {
        bg: COLORS.successLight,
        text: COLORS.success,
        label: 'Issued & Assigned ✓',
      };
    }
    if (status === 'Approved — Awaiting Store Keeper') {
      return {
        bg: COLORS.navyLight || '#EEF2F8',
        text: COLORS.primary,
        label: 'Approved • Awaiting Issue',
      };
    }
    if (status === 'Rejected') {
      return {
        bg: COLORS.errorLight || '#FDECEA',
        text: COLORS.error,
        label: 'Rejected ✕',
      };
    }
    return {
      bg: COLORS.amberLight || '#FDF1E8',
      text: COLORS.secondary,
      label: 'Pending Manager Approval',
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenTitle}>Site Inventory</Text>
          <Text style={styles.screenSubtitle}>
            Request → Manager Approval → Store Keeper Issue
          </Text>
        </View>

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>
            {activeStage === 'supervisor'
              ? 'SUPERVISOR'
              : activeStage === 'manager'
              ? 'MANAGER'
              : 'STORE KEEPER'}
          </Text>
        </View>
      </View>

      {!lockedStage && (
        <View style={styles.stageRow}>
          <TouchableOpacity
            onPress={() => setInvStage('supervisor')}
            style={[
              styles.stagePill,
              activeStage === 'supervisor' && styles.stagePillActive,
            ]}
          >
            <Text
              style={[
                styles.stagePillText,
                activeStage === 'supervisor' && styles.stagePillTextActive,
              ]}
            >
              1. Supervisor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setInvStage('manager')}
            style={[
              styles.stagePill,
              activeStage === 'manager' && styles.stagePillActive,
            ]}
          >
            <Text
              style={[
                styles.stagePillText,
                activeStage === 'manager' && styles.stagePillTextActive,
              ]}
            >
              2. Manager ({pendingManagerCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setInvStage('storekeeper')}
            style={[
              styles.stagePill,
              activeStage === 'storekeeper' && styles.stagePillActive,
            ]}
          >
            <Text
              style={[
                styles.stagePillText,
                activeStage === 'storekeeper' && styles.stagePillTextActive,
              ]}
            >
              3. Store ({readyToIssueCount})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{inventory.length}</Text>
          <Text style={styles.metricLabel}>Stock Items</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: COLORS.success }]}>
            {healthyCount}
          </Text>
          <Text style={styles.metricLabel}>Healthy</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: COLORS.secondary }]}>
            {pendingManagerCount + readyToIssueCount}
          </Text>
          <Text style={styles.metricLabel}>Open Requests</Text>
        </View>
      </View>

      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {activeStage === 'supervisor' && (
          <>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Material Requisitions</Text>
                <Text style={styles.sectionSub}>
                  Request stock from Store Keeper via Manager approval
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsRequestOpen(true)}
                style={styles.primarySmallBtn}
                activeOpacity={0.85}
              >
                <PlusIcon color="#FFFFFF" size={14} />
                <Text style={styles.primarySmallBtnText}>Request</Text>
              </TouchableOpacity>
            </View>

            {materialRequests.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyCardTitle}>No Material Requests Yet</Text>
                <Text style={styles.emptyCardSub}>
                  Tap '+ Request' to request materials from the Site / Project Manager.
                </Text>
              </View>
            ) : (
              materialRequests.map((req) => {
                const badge = getStatusBadgeStyle(req.status);
                return (
                  <View key={req.id} style={styles.requestCard}>
                    <View style={styles.requestTopRow}>
                      <Text style={styles.requestMatName}>
                        {req.materialName} • {req.quantity} {req.unit}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.requestMeta}>
                      {req.project} • {req.purpose}
                    </Text>
                    <Text style={styles.requestTime}>
                      Requested by {req.requestedBy} at {req.requestedAt}
                      {req.issuedAt ? ` • Issued at ${req.issuedAt}` : ''}
                    </Text>
                  </View>
                );
              })
            )}
          </>
        )}

        {activeStage === 'manager' && (
          <>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Manager Approval Queue</Text>
                <Text style={styles.sectionSub}>
                  Approve Supervisor requests before Store Keeper dispatch
                </Text>
              </View>
            </View>

            {materialRequests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <InventoryIcon color={COLORS.primary} size={28} />
                </View>
                <Text style={styles.emptyTitle}>No Requisitions to Review</Text>
                <Text style={styles.emptySubtitle}>
                  Material requests submitted by Supervisors will appear here for your approval.
                </Text>
              </View>
            ) : (
              materialRequests.map((req) => {
                const isPending = req.status === 'Pending Manager Approval';
                const badge = getStatusBadgeStyle(req.status);
                return (
                  <View key={req.id} style={styles.requestCard}>
                    <View style={styles.requestTopRow}>
                      <Text style={styles.requestMatName}>
                        {req.materialName} • {req.quantity} {req.unit}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.requestMeta}>
                      Site: {req.project} • {req.purpose}
                    </Text>
                    <Text style={styles.requestTime}>
                      Requested by {req.requestedBy} at {req.requestedAt}
                    </Text>

                    {isPending ? (
                      <View style={styles.decisionRow}>
                        <TouchableOpacity
                          onPress={() =>
                            onReviewMaterialRequest &&
                            onReviewMaterialRequest(req.id, 'reject')
                          }
                          style={styles.rejectBtn}
                        >
                          <Text style={styles.rejectBtnText}>Reject ✕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            onReviewMaterialRequest &&
                            onReviewMaterialRequest(req.id, 'approve')
                          }
                          style={styles.approveBtn}
                        >
                          <Text style={styles.approveBtnText}>Approve ✓</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                );
              })
            )}
          </>
        )}

        {activeStage === 'storekeeper' && (
          <>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Store Keeper Dispatch</Text>
                <Text style={styles.sectionSub}>
                  Update warehouse stock & issue approved requests
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsAddStockOpen(true)}
                style={styles.primarySmallBtn}
                activeOpacity={0.85}
              >
                <PlusIcon color="#FFFFFF" size={14} />
                <Text style={styles.primarySmallBtnText}>Add Stock</Text>
              </TouchableOpacity>
            </View>

            {/* Approved Requisitions Waiting to be Issued */}
            <Text style={styles.subGroupTitle}>Approved Requisitions</Text>
            {materialRequests.filter(
              (r) =>
                r.status === 'Approved — Awaiting Store Keeper' ||
                r.status === 'Issued & Assigned'
            ).length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyCardTitle}>No Approved Requests</Text>
                <Text style={styles.emptyCardSub}>
                  Once the Site / Project Manager approves a Supervisor request, issue it to the Supervisor here.
                </Text>
              </View>
            ) : (
              materialRequests
                .filter(
                  (r) =>
                    r.status === 'Approved — Awaiting Store Keeper' ||
                    r.status === 'Issued & Assigned'
                )
                .map((req) => {
                  const awaitingIssue =
                    req.status === 'Approved — Awaiting Store Keeper';
                  const badge = getStatusBadgeStyle(req.status);
                  return (
                    <View key={req.id} style={styles.requestCard}>
                      <View style={styles.requestTopRow}>
                        <Text style={styles.requestMatName}>
                          {req.materialName} • {req.quantity} {req.unit}
                        </Text>
                        <View
                          style={[styles.statusBadge, { backgroundColor: badge.bg }]}
                        >
                          <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                            {badge.label}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.requestMeta}>
                        Assign to: {req.requestedBy} ({req.project})
                      </Text>
                      <Text style={styles.requestTime}>
                        Approved by: {req.approvedBy || 'Manager'}
                      </Text>

                      {awaitingIssue ? (
                        <TouchableOpacity
                          onPress={() =>
                            onIssueMaterialRequest && onIssueMaterialRequest(req.id)
                          }
                          style={styles.issueBtn}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.issueBtnText}>
                            Issue & Assign to Supervisor ✓
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  );
                })
            )}
          </>
        )}

        {activeStage !== 'manager' && (
          <View style={styles.warehouseSection}>
            <Text style={styles.subGroupTitle}>Warehouse Stock</Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search materials, SKUs, storage bays..."
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

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.categoryPill,
                      isActive && styles.categoryPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isActive && styles.categoryTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {filteredInventory.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <InventoryIcon color={COLORS.secondary} size={30} />
                </View>
                <Text style={styles.emptyTitle}>No Inventory Items Yet</Text>
                <Text style={styles.emptySubtitle}>
                  Switch to Store Keeper and tap '+ Add Stock' to add warehouse materials.
                </Text>
              </View>
            ) : (
              filteredInventory.map((item) => {
                const isLow = item.stock <= item.minBuffer;
                return (
                  <View key={item.id} style={styles.materialCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.itemTitleGroup}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemMeta}>
                          SKU: {item.sku} • {item.category} • {item.location}
                        </Text>
                      </View>
                      {isLow ? (
                        <View style={styles.lowStockPill}>
                          <Text style={styles.lowStockText}>LOW</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.stockCounterRow}>
                      <Text style={styles.currentStockText}>
                        {item.stock} <Text style={styles.unitText}>{item.unit}</Text>
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        <View style={styles.auditLogSection}>
          <Text style={styles.auditLogHeader}>Recent Material Dispatch</Text>
          <Text style={styles.auditLogSubtitle}>
            Approved & issued stock history
          </Text>

          {inventoryLog.length === 0 ? (
            <View style={styles.emptyLogCard}>
              <Text style={styles.emptyLogText}>
                No material dispatches logged yet. Issued materials will appear here.
              </Text>
            </View>
          ) : (
            inventoryLog.map((log) => (
              <View key={log.id} style={styles.auditLogCard}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.auditMatName}>{log.materialName}</Text>
                  <Text style={styles.auditLogMeta}>
                    {log.project} • {log.purpose}
                  </Text>
                  <Text style={styles.auditLogTime}>
                    Approved by {log.manager} • {log.timestamp}
                  </Text>
                </View>
                <Text style={styles.auditQtyText}>
                  −{log.quantity} {log.unit}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      {deductTarget && (
        <DeductMaterialModal
          visible={!!deductTarget}
          material={deductTarget}
          projects={projects}
          onClose={() => setDeductTarget(null)}
          onDeduct={(data) => {
            if (onDeductMaterial) onDeductMaterial(data);
          }}
        />
      )}

      <AddInventoryModal
        visible={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onAddStock={(item) => onAddInventoryItem && onAddInventoryItem(item)}
      />

      <RequestMaterialModal
        visible={isRequestOpen}
        inventory={inventory}
        projects={projects}
        onClose={() => setIsRequestOpen(false)}
        onSubmitRequest={(req) =>
          onSubmitMaterialRequest && onSubmitMaterialRequest(req)
        }
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
  stageRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
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
  metricRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingVertical: 10,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  primarySmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
  },
  primarySmallBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  subGroupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 6,
    marginBottom: 8,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderStyle: 'dashed',
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptyCardSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  requestCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 10,
  },
  requestTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  requestMatName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
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
  requestMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  decisionRow: {
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
  rejectBtnText: {
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
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  issueBtn: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  issueBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  warehouseSection: {
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  clearSearchText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    paddingLeft: 8,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  categoryPill: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
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
  emptyIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.amberLight || '#FDF1E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
  materialCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  itemTitleGroup: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  lowStockPill: {
    backgroundColor: 'rgba(234, 106, 32, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lowStockText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  stockCounterRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentStockText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  auditLogSection: {
    marginTop: 12,
  },
  auditLogHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  auditLogSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  emptyLogCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 16,
  },
  emptyLogText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  auditLogCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 12,
    marginBottom: 8,
  },
  auditMatName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  auditLogMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  auditLogTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  auditQtyText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
  },
});
