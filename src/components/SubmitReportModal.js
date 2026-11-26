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

const FILE_TYPES = ['PDF (.pdf)', 'Excel (.xlsx)'];
const REPORT_CATEGORIES = [
  'Daily Progress',
  'QA / QC Inspection',
  'Structural Test',
  'Safety & Site Decor',
];

export default function SubmitReportModal({
  visible,
  projects = [],
  userRole = 'Supervisor',
  onClose,
  onSubmitReport,
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Daily Progress');
  const [fileType, setFileType] = useState('PDF (.pdf)');
  const [fileName, setFileName] = useState('');
  const [projectName, setProjectName] = useState(
    projects.length > 0 ? projects[0].name : ''
  );
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    Keyboard.dismiss();

    if (!title.trim()) {
      setError('Report title is required.');
      return;
    }

    const ext = fileType.includes('PDF') ? '.pdf' : '.xlsx';
    const cleanFile =
      fileName.trim() ||
      `${title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')}${ext}`;

    onSubmitReport({
      id: `RPT-${String(Date.now()).slice(-5)}`,
      title: title.trim(),
      category,
      fileFormat: fileType.includes('PDF') ? 'PDF' : 'EXCEL',
      fileName: cleanFile.endsWith(ext) ? cleanFile : `${cleanFile}${ext}`,
      project: projectName.trim() || 'Main Construction Site',
      notes: notes.trim() || 'Submitted for Manager review.',
      submitterRole:
        userRole === 'Engineer' ? 'Engineer' : 'Supervisor',
      submittedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Submitted to Manager',
    });

    setTitle('');
    setFileName('');
    setNotes('');
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
              <Text style={styles.title}>Submit Site Report</Text>
              <Text style={styles.subtitle}>
                Upload PDF or Excel report for Site / Project Manager
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

            <AuthInput
              label="Report Title *"
              placeholder="e.g. Level 3 Slab Concrete QA Report"
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (error) setError(null);
              }}
            />

            <Text style={styles.fieldLabel}>Report Format</Text>
            <View style={styles.chipRow}>
              {FILE_TYPES.map((ft) => {
                const active = fileType === ft;
                return (
                  <TouchableOpacity
                    key={ft}
                    onPress={() => setFileType(ft)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {ft}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <AuthInput
              label="Attachment File Name"
              placeholder={
                fileType.includes('PDF')
                  ? 'e.g. slab_qa_report.pdf'
                  : 'e.g. daily_progress_sheet.xlsx'
              }
              value={fileName}
              onChangeText={setFileName}
              autoCapitalize="none"
            />

            <Text style={styles.fieldLabel}>Report Category</Text>
            <View style={styles.chipRow}>
              {REPORT_CATEGORIES.map((cat) => {
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
              label="Site / Project"
              placeholder="Enter site or project name"
              value={projectName}
              onChangeText={setProjectName}
            />

            <AuthInput
              label="Summary Notes"
              placeholder="Key observations or test results..."
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.btnWrapper}>
              <PrimaryButton title="Submit Report to Manager →" onPress={handleSubmit} />
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
