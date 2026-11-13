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

export default function CreateProjectModal({ visible, onClose, onCreateProject }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState(null);

  const handleCreate = () => {
    Keyboard.dismiss();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }

    const newProject = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      category: category.trim() || 'General Construction',
      location: location.trim() || 'Main Site',
      progress: 5,
      status: 'Site Prep',
      statusVariant: 'neutral',
      phase: 'Initial Site Survey & Mobilization',
      deadline: deadline.trim() || 'Q4 2027',
      budget: '$10.0M',
      contractor: 'Structra Direct',
      tasksCount: 1,
    };

    onCreateProject(newProject);
    // Reset fields
    setName('');
    setCategory('');
    setLocation('');
    setDeadline('');
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
          {/* Grab handle */}
          <View style={styles.grabHandle} />

          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Create New Project</Text>
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
            <AuthInput
              label="Project Name *"
              placeholder="e.g. Shivalik Skyline Tower"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (error) setError(null);
              }}
              error={error}
            />

            <AuthInput
              label="Sector / Category"
              placeholder="e.g. Commercial High-Rise, Residential"
              value={category}
              onChangeText={setCategory}
            />

            <AuthInput
              label="Site Location (Ahmedabad)"
              placeholder="e.g. SG Highway, Bodakdev, Ahmedabad"
              value={location}
              onChangeText={setLocation}
            />

            <AuthInput
              label="Target Completion"
              placeholder="e.g. Q3 2027"
              value={deadline}
              onChangeText={setDeadline}
            />

            <View style={styles.buttonRow}>
              <PrimaryButton
                title="Create Project"
                onPress={handleCreate}
                style={{ flex: 1 }}
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
    maxHeight: '85%',
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
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  closeButton: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '700',
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  buttonRow: {
    marginTop: 8,
    flexDirection: 'row',
  },
});
