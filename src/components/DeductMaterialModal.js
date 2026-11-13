import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { COLORS } from '../constants/colors';
import PrimaryButton from './PrimaryButton';

export default function DeductMaterialModal({
  visible,
  material,
  projects = [],
  onClose,
  onDeduct,
}) {
  const [quantity, setQuantity] = useState('');
  const [selectedProject, setSelectedProject] = useState(
    projects.length > 0 ? projects[0].name : 'Shivalik Skyview Corporate Tower'
  );
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState(null);

  if (!material) return null;

  const currentStock = material.stock;
  const unit = material.unit;

  const handleConfirm = () => {
    Keyboard.dismiss();
    const qtyNum = parseFloat(quantity);

    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError('Please enter a valid quantity greater than 0.');
      return;
    }

    if (qtyNum > currentStock) {
      setError(`Cannot deduct more than available stock (${currentStock} ${unit}).`);
      return;
    }

    onDeduct({
      materialId: material.id,
      materialName: material.name,
      quantity: qtyNum,
      unit: material.unit,
      project: selectedProject,
      purpose: purpose.trim() || 'General Site Construction',
      timestamp: 'Just now',
    });

    // Reset and close
    setQuantity('');
    setPurpose('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.grabHandle} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Log Material Usage</Text>
              <Text style={styles.headerSubtitle}>Minus from site inventory</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Target Material Badge */}
            <View style={styles.materialPreviewCard}>
              <View style={styles.materialInfoCol}>
                <Text style={styles.materialNameText}>{material.name}</Text>
                <Text style={styles.materialLocationText}>
                  Location: {material.location} • SKU: {material.sku}
                </Text>
              </View>
              <View style={styles.stockBadge}>
                <Text style={styles.stockCountText}>{currentStock}</Text>
                <Text style={styles.stockUnitText}>{unit} left</Text>
              </View>
            </View>

            {/* Quantity Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Quantity to Deduct ({unit}) *
              </Text>
              <View style={[styles.inputBox, error && styles.inputBoxError]}>
                <TextInput
                  style={styles.textInput}
                  placeholder={`e.g. 25`}
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={(text) => {
                    setQuantity(text);
                    if (error) setError(null);
                  }}
                />
                <Text style={styles.unitSuffix}>{unit}</Text>
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* Quick Fill Percentage Buttons */}
            <View style={styles.quickFillRow}>
              {[10, 25, 50, 100].map((pct) => (
                <TouchableOpacity
                  key={pct}
                  style={styles.quickFillBtn}
                  onPress={() => {
                    const calc = Math.min(
                      currentStock,
                      Math.round((currentStock * (pct / 100)) * 10) / 10
                    );
                    setQuantity(calc.toString());
                    if (error) setError(null);
                  }}
                >
                  <Text style={styles.quickFillText}>{pct}%</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Project Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Applied To Project *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.projectPillsRow}
              >
                {projects.map((proj) => {
                  const isSelected = selectedProject === proj.name;
                  return (
                    <TouchableOpacity
                      key={proj.id}
                      onPress={() => setSelectedProject(proj.name)}
                      style={[
                        styles.projectPill,
                        isSelected && styles.projectPillSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.projectPillText,
                          isSelected && styles.projectPillTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {proj.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Purpose / Task Note */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Purpose / Task Description</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Level 24 Shear Wall Concreting"
                  placeholderTextColor={COLORS.textSecondary}
                  value={purpose}
                  onChangeText={setPurpose}
                />
              </View>
            </View>

            {/* Role Notice */}
            <View style={styles.roleNoticeCard}>
              <Text style={styles.roleNoticeTitle}>SITE SUPERVISOR DISPATCH</Text>
              <Text style={styles.roleNoticeBody}>
                This deduction will be subtracted directly from live site inventory and logged in the dispatch history. Restocking is restricted to Procurement Admin.
              </Text>
            </View>

            {/* Submit Button */}
            <View style={styles.actionRow}>
              <PrimaryButton
                title={`Deduct ${quantity ? quantity + ' ' + unit : 'Material'}`}
                onPress={handleConfirm}
                variant="secondary"
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.overlay,
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  grabHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.inputBorder,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '700',
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  materialPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  materialInfoCol: {
    flex: 1,
    paddingRight: 12,
  },
  materialNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  materialLocationText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  stockBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  stockCountText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  stockUnitText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
  },
  inputBoxError: {
    borderColor: COLORS.error,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  unitSuffix: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '500',
    marginTop: 6,
  },
  quickFillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    marginTop: -8,
  },
  quickFillBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  quickFillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  projectPillsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  projectPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
  },
  projectPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  projectPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  projectPillTextSelected: {
    color: COLORS.background,
  },
  roleNoticeCard: {
    backgroundColor: COLORS.amberLight,
    borderWidth: 1,
    borderColor: '#F2D3BE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  roleNoticeTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  roleNoticeBody: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textPrimary,
  },
  actionRow: {
    width: '100%',
  },
});
