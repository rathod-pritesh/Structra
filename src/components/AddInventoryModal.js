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

const CATEGORIES = ['Structural', 'Masonry', 'Electrical'];
const UNITS = ['Bags', 'Tons', 'Pieces', 'Meters', 'Liters'];

export default function AddInventoryModal({ visible, onClose, onAddStock }) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Structural');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('Bags');
  const [minBuffer, setMinBuffer] = useState('10');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);

  const handleSave = () => {
    Keyboard.dismiss();

    if (!name.trim()) {
      setError('Material name is required.');
      return;
    }

    const stockNum = parseFloat(stock);
    if (isNaN(stockNum) || stockNum <= 0) {
      setError('Please enter a valid stock quantity greater than 0.');
      return;
    }

    const bufferNum = parseFloat(minBuffer);

    onAddStock({
      id: `mat-${Date.now()}`,
      name: name.trim(),
      sku: sku.trim() || `SKU-${String(Date.now()).slice(-4)}`,
      category,
      stock: stockNum,
      unit,
      minBuffer: isNaN(bufferNum) ? 10 : bufferNum,
      location: location.trim() || 'Main Warehouse',
    });

    setName('');
    setSku('');
    setStock('');
    setLocation('');
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
              <Text style={styles.title}>Add Warehouse Stock</Text>
              <Text style={styles.subtitle}>Store Keeper — Inventory Entry</Text>
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

            <AuthInput
              label="Material Name *"
              placeholder="e.g. OPC 53 Grade Cement"
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (error) setError(null);
              }}
            />

            <AuthInput
              label="SKU / Material Code"
              placeholder="e.g. CEM-OPC53"
              value={sku}
              onChangeText={setSku}
              autoCapitalize="characters"
            />

            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <AuthInput
              label="Initial Quantity *"
              placeholder="e.g. 250"
              value={stock}
              onChangeText={(t) => {
                setStock(t);
                if (error) setError(null);
              }}
              keyboardType="numeric"
            />

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
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <AuthInput
              label="Low Stock Alert Buffer"
              placeholder="10"
              value={minBuffer}
              onChangeText={setMinBuffer}
              keyboardType="numeric"
            />

            <AuthInput
              label="Storage Bay / Location"
              placeholder="e.g. Shed A - Rack 2"
              value={location}
              onChangeText={setLocation}
            />

            <View style={styles.btnWrapper}>
              <PrimaryButton title="Save to Inventory" onPress={handleSave} />
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
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
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
