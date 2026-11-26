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

const TRADES = ['Mason', 'Helper', 'Bar Bender', 'Carpenter', 'Electrician', 'Plumber'];

export default function AddWorkerModal({ visible, onClose, onAddWorker }) {
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('Mason');
  const [dailyWage, setDailyWage] = useState('');
  const [shift, setShift] = useState('Day Shift (8 AM - 5 PM)');
  const [error, setError] = useState(null);

  const handleAdd = () => {
    Keyboard.dismiss();

    if (!name.trim()) {
      setError('Worker name is required.');
      return;
    }

    const wageNum = parseFloat(dailyWage);
    if (isNaN(wageNum) || wageNum <= 0) {
      setError('Please enter a valid daily wage amount (₹).');
      return;
    }

    onAddWorker({
      id: `worker-${Date.now()}`,
      name: name.trim(),
      trade,
      dailyWage: wageNum,
      shift: shift.trim() || 'Day Shift',
      status: 'Present',
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setName('');
    setDailyWage('');
    setTrade('Mason');
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
              <Text style={styles.title}>Enroll Site Worker</Text>
              <Text style={styles.subtitle}>Add labourer to daily attendance roster</Text>
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
              label="Worker Full Name *"
              placeholder="Enter worker name"
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (error) setError(null);
              }}
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Trade / Skill</Text>
            <View style={styles.tradeRow}>
              {TRADES.map((item) => {
                const active = trade === item;
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setTrade(item)}
                    style={[styles.tradeChip, active && styles.tradeChipActive]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.tradeChipText,
                        active && styles.tradeChipTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <AuthInput
              label="Daily Wage (₹) *"
              placeholder="e.g. 650"
              value={dailyWage}
              onChangeText={(t) => {
                setDailyWage(t);
                if (error) setError(null);
              }}
              keyboardType="numeric"
            />

            <AuthInput
              label="Shift Timing"
              placeholder="Day Shift (8 AM - 5 PM)"
              value={shift}
              onChangeText={setShift}
            />

            <View style={styles.btnWrapper}>
              <PrimaryButton title="Add to Roster" onPress={handleAdd} />
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
    maxHeight: '88%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  tradeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tradeChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tradeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tradeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tradeChipTextActive: {
    color: '#FFFFFF',
  },
  btnWrapper: {
    marginTop: 8,
    marginBottom: 10,
  },
});
