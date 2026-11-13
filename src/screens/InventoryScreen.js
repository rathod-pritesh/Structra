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
import { InventoryIcon, MinusIcon } from '../components/Icons';
import DeductMaterialModal from '../components/DeductMaterialModal';

export default function InventoryScreen({
  inventory = [],
  inventoryLog = [],
  projects = [],
  onDeductMaterial,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deductTarget, setDeductTarget] = useState(null);

  const categories = ['All', 'Structural', 'Masonry', 'Electrical', 'Low Stock'];

  const lowStockItems = inventory.filter((item) => item.stock <= item.minBuffer);
  const healthyCount = Math.max(inventory.length - lowStockItems.length, 0);

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

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenTitle}>Site Inventory</Text>
          <Text style={styles.screenSubtitle}>
            Material Stock & Field Consumption
          </Text>
        </View>

        {/* Role Badge */}
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>SUPERVISOR</Text>
        </View>
      </View>

      {/* Role Permission Notice */}
      <View style={styles.permissionNotice}>
        <View style={styles.permissionDot} />
        <Text style={styles.permissionText}>
          Field Mode: You can deduct stock as used on site. Adding or purchasing stock is managed by Admin.
        </Text>
      </View>

      {/* Overview Metric Cards */}
      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{inventory.length}</Text>
          <Text style={styles.metricLabel}>Total Items</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: COLORS.success }]}>
            {healthyCount}
          </Text>
          <Text style={styles.metricLabel}>Healthy Stock</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: COLORS.secondary }]}>
            {lowStockItems.length}
          </Text>
          <Text style={styles.metricLabel}>Low Stock Alert</Text>
        </View>
      </View>

      {/* Search Input */}
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

      {/* Category Switcher Pills */}
      <View>
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
      </View>

      {/* Main Material List / Empty State */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredInventory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <InventoryIcon color={COLORS.secondary} size={32} />
            </View>
            <Text style={styles.emptyTitle}>No Inventory Items Yet</Text>
            <Text style={styles.emptySubtitle}>
              Material stock configured in the backend by Procurement Admin will appear here. You will be able to log usage and deduct stock directly.
            </Text>
          </View>
        ) : (
          filteredInventory.map((item) => (
            <View key={item.id} style={styles.materialCard}>
              <View style={styles.cardHeader}>
                <View style={styles.itemTitleGroup}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    SKU: {item.sku} • {item.location}
                  </Text>
                </View>
              </View>

              <View style={styles.stockCounterRow}>
                <Text style={styles.currentStockText}>
                  {item.stock} <Text style={styles.unitText}>{item.unit}</Text>
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setDeductTarget(item)}
                style={styles.deductButton}
              >
                <MinusIcon color={COLORS.background} size={14} />
                <Text style={styles.deductButtonText}>Log Material Usage</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Recent Material Consumption Log Section */}
        <View style={styles.auditLogSection}>
          <Text style={styles.auditLogHeader}>Recent Material Dispatch</Text>
          <Text style={styles.auditLogSubtitle}>
            Recorded on-site consumption log
          </Text>

          {inventoryLog.length === 0 ? (
            <View style={styles.emptyLogCard}>
              <Text style={styles.emptyLogText}>
                No material deductions logged yet. Deductions made on site will appear here.
              </Text>
            </View>
          ) : (
            inventoryLog.map((log) => (
              <View key={log.id} style={styles.auditLogCard}>
                <Text style={styles.auditMatName}>{log.materialName}</Text>
                <Text style={styles.auditQtyText}>
                  −{log.quantity} {log.unit}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Deduction Modal */}
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
    fontSize: 12,
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
    letterSpacing: 0.8,
  },
  permissionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  permissionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginRight: 8,
  },
  permissionText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 15,
  },
  metricRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 10,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
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
    color: COLORS.background,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.amberLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  materialCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemTitleGroup: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  stockCounterRow: {
    marginBottom: 10,
  },
  currentStockText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  unitText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  deductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  deductButtonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '700',
  },
  auditLogSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  auditLogHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
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
    alignItems: 'center',
  },
  emptyLogText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  auditLogCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  auditMatName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  auditQtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
});
