import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';
import { pickImageFromGallery, capturePhotoWithCamera } from '../utils/imagePicker';

interface PresetItem {
  label: string;
  url: string;
}

interface ImageUploaderProps {
  label: string;
  value: string;
  onChangeImage: (uri: string) => void;
  aspectRatio?: [number, number];
  presets?: PresetItem[];
  hint?: string;
  previewHeight?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChangeImage,
  aspectRatio,
  presets,
  hint,
  previewHeight = 160,
}) => {
  const [loading, setLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);

  const handlePickFromGallery = async () => {
    setLoading(true);
    try {
      const uri = await pickImageFromGallery({ aspect: aspectRatio });
      if (uri) {
        onChangeImage(uri);
        setManualUrl(uri);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureCamera = async () => {
    setLoading(true);
    try {
      const uri = await capturePhotoWithCamera({ aspect: aspectRatio });
      if (uri) {
        onChangeImage(uri);
        setManualUrl(uri);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    onChangeImage('');
    setManualUrl('');
  };

  const handleManualUrlChange = (text: string) => {
    setManualUrl(text);
    onChangeImage(text);
  };

  const isUploadedFile = value && value.startsWith('data:');
  const isWebUrl = value && (value.startsWith('http://') || value.startsWith('https://'));

  return (
    <View style={styles.container}>
      {/* Label and Badge */}
      <View style={styles.headerRow}>
        <View style={styles.labelGroup}>
          <Text style={styles.label}>{label}</Text>
          {hint && <Text style={styles.hint}>{hint}</Text>}
        </View>

        {Boolean(value) && (
          <View
            style={[
              styles.sourceBadge,
              isUploadedFile ? styles.sourceBadgeUpload : styles.sourceBadgeUrl,
            ]}
          >
            <Ionicons
              name={isUploadedFile ? 'cloud-done-outline' : 'link-outline'}
              size={12}
              color={isUploadedFile ? theme.colors.primary : theme.colors.accent}
            />
            <Text
              style={[
                styles.sourceBadgeText,
                { color: isUploadedFile ? theme.colors.primary : theme.colors.accent },
              ]}
            >
              {isUploadedFile ? 'Device Upload' : 'Web Link'}
            </Text>
          </View>
        )}
      </View>

      {/* Main Upload / Preview Area */}
      {value ? (
        <View style={styles.previewContainer}>
          <View style={[styles.previewFrame, { height: previewHeight }]}>
            <Image source={{ uri: value }} style={styles.previewImage} resizeMode="cover" />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Processing image...</Text>
              </View>
            )}
          </View>

          {/* Action buttons when image exists */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={handlePickFromGallery}
              disabled={loading}
            >
              <Ionicons name="cloud-upload" size={15} color="#FFFFFF" />
              <Text style={styles.actionBtnTextPrimary}>Change Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnSecondary}
              onPress={handleCaptureCamera}
              disabled={loading}
            >
              <Ionicons name="camera-outline" size={15} color={theme.colors.textPrimary} />
              <Text style={styles.actionBtnTextSecondary}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={handleRemoveImage}
              disabled={loading}
            >
              <Ionicons name="trash-outline" size={15} color={theme.colors.danger} />
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Empty Upload Dropzone */
        <TouchableOpacity
          style={styles.dropzone}
          onPress={handlePickFromGallery}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.emptyLoadingState}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Selecting image...</Text>
            </View>
          ) : (
            <>
              <View style={styles.uploadIconCircle}>
                <Ionicons name="cloud-upload" size={28} color={theme.colors.primary} />
              </View>
              <Text style={styles.uploadMainTitle}>Click or tap to upload photo</Text>
              <Text style={styles.uploadSubTitle}>
                Supports JPG, PNG, WEBP from your device
              </Text>

              <View style={styles.buttonOptionsRow}>
                <View style={styles.uploadChip}>
                  <Ionicons name="folder-open-outline" size={14} color={theme.colors.textPrimary} />
                  <Text style={styles.uploadChipText}>Browse Device</Text>
                </View>

                <TouchableOpacity
                  style={styles.uploadChipCamera}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleCaptureCamera();
                  }}
                >
                  <Ionicons name="camera-outline" size={14} color={theme.colors.primary} />
                  <Text style={styles.uploadChipCameraText}>Use Camera</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Accordion Toggle for URL or Presets */}
      <TouchableOpacity
        style={styles.urlToggle}
        onPress={() => setShowUrlInput((prev) => !prev)}
      >
        <Ionicons
          name={showUrlInput ? 'chevron-up-circle-outline' : 'chevron-down-circle-outline'}
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.urlToggleText}>
          {showUrlInput ? 'Hide URL & Presets' : 'Or enter image URL / pick preset'}
        </Text>
      </TouchableOpacity>

      {/* URL Input & Presets Dropdown */}
      {showUrlInput && (
        <View style={styles.urlSection}>
          <View style={styles.urlInputRow}>
            <Ionicons name="link" size={16} color={theme.colors.textMuted} style={styles.urlIcon} />
            <TextInput
              style={styles.urlTextInput}
              value={manualUrl}
              onChangeText={handleManualUrlChange}
              placeholder="Paste https:// image URL here..."
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {Boolean(manualUrl) && (
              <TouchableOpacity
                onPress={() => handleManualUrlChange('')}
                style={styles.clearUrlBtn}
              >
                <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Presets */}
          {presets && presets.length > 0 && (
            <View style={styles.presetsBlock}>
              <Text style={styles.presetsTitle}>Curated Presets:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.presetsScrollView}
              >
                {presets.map((preset, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.presetChip,
                      value === preset.url && styles.presetChipActive,
                    ]}
                    onPress={() => {
                      onChangeImage(preset.url);
                      setManualUrl(preset.url);
                    }}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        value === preset.url && styles.presetChipTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  sourceBadgeUpload: {
    backgroundColor: theme.colors.primaryLight,
  },
  sourceBadgeUrl: {
    backgroundColor: theme.colors.accentLight,
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dropzone: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLoadingState: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  uploadIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadMainTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  uploadSubTitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 14,
    textAlign: 'center',
  },
  buttonOptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  uploadChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  uploadChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  uploadChipCamera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  uploadChipCameraText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  previewContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
  },
  previewFrame: {
    width: '100%',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    backgroundColor: '#000000',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
  },
  actionBtnTextPrimary: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionBtnTextSecondary: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: theme.colors.dangerLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  removeBtnText: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  urlToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  urlToggleText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  urlSection: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.radius.sm,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  urlInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
  },
  urlIcon: {
    marginRight: 6,
  },
  urlTextInput: {
    flex: 1,
    height: 38,
    color: theme.colors.textPrimary,
    fontSize: 13,
  },
  clearUrlBtn: {
    padding: 4,
  },
  presetsBlock: {
    marginTop: 10,
  },
  presetsTitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsScrollView: {
    flexDirection: 'row',
  },
  presetChip: {
    backgroundColor: theme.colors.cardBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  presetChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  presetChipText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  presetChipTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
