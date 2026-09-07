import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurants } from '../context/RestaurantContext';
import { theme } from '../theme/colors';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ visible, onClose }) => {
  const { restaurants, importRestaurants, showToast } = useRestaurants();
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importJsonText, setImportJsonText] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate clean TypeScript output matching the exact format user provided
  const tsCodeOutput = `import { Restaurant } from '../types';

export const RESTAURANTS_DATA: Restaurant[] = ${JSON.stringify(restaurants, null, 2)};
`;

  const handleCopy = () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(tsCodeOutput);
      }
      setCopied(true);
      showToast('TypeScript code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast('Failed to copy. Please manually select and copy.', 'error');
    }
  };

  const handleDownload = (format: 'ts' | 'json') => {
    try {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const content = format === 'ts' ? tsCodeOutput : JSON.stringify(restaurants, null, 2);
        const filename = format === 'ts' ? 'restaurantsData.ts' : 'restaurantsData.json';
        const blob = new Blob([content], {
          type: format === 'ts' ? 'text/typescript' : 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Downloaded ${filename}!`, 'success');
      } else {
        handleCopy();
      }
    } catch (err) {
      showToast('Error preparing download', 'error');
    }
  };

  const handleRunImport = () => {
    if (!importJsonText.trim()) {
      showToast('Please paste valid JSON data to import', 'error');
      return;
    }

    try {
      let cleaned = importJsonText.trim();
      // Handle case where user pasted `export const RESTAURANTS_DATA: Restaurant[] = [...]`
      if (cleaned.includes('RESTAURANTS_DATA')) {
        const match = cleaned.match(/=\s*(\[[\s\S]*\]);?/);
        if (match && match[1]) {
          cleaned = match[1];
        }
      }

      const parsed = JSON.parse(cleaned);
      const success = importRestaurants(parsed);
      if (success) {
        setImportJsonText('');
        onClose();
      }
    } catch (err: any) {
      showToast(`Invalid JSON format: ${err.message}`, 'error');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>Data Hub & Code Export</Text>
              <Text style={styles.modalSubtitle}>
                Export clean TypeScript/JSON matching your exact schema or import backups
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'export' && styles.tabBtnActive]}
              onPress={() => setActiveTab('export')}
            >
              <Ionicons
                name="code-download-outline"
                size={16}
                color={activeTab === 'export' ? theme.colors.primary : theme.colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'export' && styles.tabBtnTextActive,
                ]}
              >
                Export TypeScript / JSON
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'import' && styles.tabBtnActive]}
              onPress={() => setActiveTab('import')}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={16}
                color={activeTab === 'import' ? theme.colors.primary : theme.colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'import' && styles.tabBtnTextActive,
                ]}
              >
                Import JSON
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          {activeTab === 'export' ? (
            <View style={styles.tabContent}>
              <View style={styles.exportMetaRow}>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipLabel}>Restaurants:</Text>
                  <Text style={styles.metaChipVal}>{restaurants.length}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipLabel}>Total Dishes:</Text>
                  <Text style={styles.metaChipVal}>
                    {restaurants.reduce((acc, r) => acc + (r.menu?.length || 0), 0)}
                  </Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipLabel}>Format:</Text>
                  <Text style={[styles.metaChipVal, { color: theme.colors.primary }]}>
                    TypeScript Schema
                  </Text>
                </View>
              </View>

              <View style={styles.codeContainer}>
                <ScrollView style={styles.codeScroll} nestedScrollEnabled>
                  <Text style={styles.codeText} selectable>
                    {tsCodeOutput}
                  </Text>
                </ScrollView>
              </View>

              <View style={styles.actionsBar}>
                <TouchableOpacity
                  style={[styles.actionBtn, copied && styles.copiedBtn]}
                  onPress={handleCopy}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={copied ? 'checkmark' : 'copy-outline'}
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text style={styles.actionBtnText}>
                    {copied ? 'Copied to Clipboard!' : 'Copy TypeScript Code'}
                  </Text>
                </TouchableOpacity>

                {Platform.OS === 'web' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.downloadBtn]}
                      onPress={() => handleDownload('ts')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="download-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Download .ts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.downloadJsonBtn]}
                      onPress={() => handleDownload('json')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="document-text-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Download .json</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <Text style={styles.importNotice}>
                Paste an array of Restaurant objects or the whole `export const RESTAURANTS_DATA = [...]` block below.
              </Text>

              <TextInput
                style={styles.importInput}
                value={importJsonText}
                onChangeText={setImportJsonText}
                placeholder="[ { id: '...', name: '...', menu: [...] } ]"
                placeholderTextColor={theme.colors.textMuted}
                multiline
              />

              <View style={styles.actionsBar}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.importBtn]}
                  onPress={handleRunImport}
                  activeOpacity={0.8}
                >
                  <Ionicons name="cloud-upload" size={16} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Import & Replace Data</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '90%',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: '#0E1422',
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: theme.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
  },
  tabBtnText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: theme.colors.textPrimary,
  },
  tabContent: {
    padding: 20,
    flex: 1,
  },
  exportMetaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metaChipLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  metaChipVal: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  codeContainer: {
    backgroundColor: '#080C14',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: theme.radius.md,
    height: 380,
    overflow: 'hidden',
  },
  codeScroll: {
    padding: 16,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#86EFAC',
    lineHeight: 18,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.radius.sm,
  },
  copiedBtn: {
    backgroundColor: '#059669',
  },
  downloadBtn: {
    backgroundColor: theme.colors.accent,
  },
  downloadJsonBtn: {
    backgroundColor: '#374151',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  importNotice: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  importInput: {
    backgroundColor: '#080C14',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: theme.radius.md,
    padding: 14,
    color: '#F9FAFB',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    height: 320,
    textAlignVertical: 'top',
  },
  importBtn: {
    backgroundColor: theme.colors.primary,
  },
});
