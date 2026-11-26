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
  Keyboard,
} from 'react-native';
import { COLORS } from '../constants/colors';
import AuthInput from './AuthInput';
import PrimaryButton from './PrimaryButton';

const UNITS = ['Bags', 'Tons', 'Pieces', 'Meters', 'Liters'];

export default function RequestMaterialModal({
  visible,
  inventory = [],
  projects = [],
  onClose,
  onSubmitRequest,
}) {
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [customMaterialName, setCustomMaterialName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Bags');
  const [projectName, setProjectName] = useState(
    projects.length > 0 ? projects[0].name : ''
  );
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState(null);

  const selectedItem = inventory.find((m) => m.id === selectedMaterialId);

  const handleSelectInventoryItem = (item) => {
    setSelectedMaterialId(item.id);
    setCustomMaterialName(item.name);
    setUnit(item.unit || 'Bags');
    if (error) setError(null);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();

    const matName = selectedItem ? selectedItem.name : customMaterialName.trim();
    if (!matName) {
      setError('Please select or enter a material name.');
      return;
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError('Please enter a valid requested quantity greater than 0.');
      return;
    }

    onSubmitRequest({
      id: `REQ-${String(Date.now()).slice(-5)}`,
      materialId: selectedItem ? selectedItem.id : null,
      materialName: matName,
      quantity: qtyNum,
      unit: selectedItem ? selectedItem.unit : unit,
      project: projectName.trim() || 'Main Construction Site',
      purpose: purpose.trim() || 'Site Construction Requirement',
      status: 'Pending Manager Approval',
      requestedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    setSelectedMaterialId(null);
    setCustomMaterialName('');
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Request Site Material</Text>
              <Text style={styles.subtitle}>
                Step 1: Sent to Site / Project Manager for approval
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {inventory.length > 0 ? (
              <View style={styles.sectionBlock}>
                <Text style={styles.fieldLabel}>Select from Warehouse Stock</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.stockScroll}
                >
                  {inventory.map((item) => {
                    const active = selectedMaterialId === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => handleSelectInventoryItem(item)}
                        style={[styles.stockChip, active && styles.stockChipActive]}
                      >
                        <Text
                          style={[
                            styles.stockChipTitle,
                            active && styles.stockChipTextActive,
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.stockChipQty,
                            active && styles.stockChipTextActive,
                          ]}
                        >
                          Avail: {item.stock} {item.unit}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}

            <AuthInput
              label="Material Name *"
              placeholder="e.g. TMT Steel Bars 12mm"
              value={customMaterialName}
              onChangeText={(t) => {
                setSelectedMaterialId(null);
                setCustomMaterialName(t);
                if (error) setError(null);
              }}
            />

            <AuthInput
              label="Quantity Needed *"
              placeholder="e.g. 50"
              value={quantity}
              onChangeText={(t) => {
                setQuantity(t);
                if (error) setError(null);
              }}
              keyboardType="numeric"
            />

            {!selectedItem ? (
              <>
                <Text style={styles.fieldLabel}>Unit</Text>
                <View style={styles.chipRow}>
                  {UNITS.map((u) => {
                    const active = unit === u;
                    return (
                      <TouchableOpacity
                        key={u}
                        onPress={() => setUnit(u)}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text
                          style={[styles.chipText, active && styles.chipTextActive]}
                        >
                          {u}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : null}

            <AuthInput
              label="Site / Project Name"
              placeholder="e.g. Block B Foundation"
              value={projectName}
              onChangeText={setProjectName}
            />

            <AuthInput
              label="Purpose / Work Area"
              placeholder="e.g. Column slab casting"
              value={purpose}
              onChangeText={setPurpose}
            />

            <View style={styles.btnWrapper}>
              <PrimaryButton
                title="Send Request to Manager →"
                onPress={handleSubmit}
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
    backgroundColor: 'rgba(15, 25, 45, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  errorBox: {
    backgroundColor: COLORS.errorLight || '#FDECEA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
  },
  sectionBlock: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  stockScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  stockChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stockChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stockChipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  stockChipQty: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  stockChipTextActive: {
    color: '#FFFFFF',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  btnWrapper: {
    marginTop: 8,
    marginBottom: 10,
  },
});
