import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurants } from '../context/RestaurantContext';
import { theme } from '../theme/colors';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useRestaurants();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.toastBox,
          isSuccess && styles.successBox,
          isError && styles.errorBox,
        ]}
      >
        <Ionicons
          name={isSuccess ? 'checkmark-circle' : isError ? 'alert-circle' : 'information-circle'}
          size={20}
          color={isSuccess ? theme.colors.primary : isError ? theme.colors.danger : theme.colors.accent}
        />
        <Text style={styles.toastText}>{toast.message}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeBtn}>
          <Ionicons name="close" size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 24,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    maxWidth: 540,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  successBox: {
    borderColor: 'rgba(16, 185, 129, 0.5)',
    backgroundColor: '#0f241d',
  },
  errorBox: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    backgroundColor: '#271214',
  },
  toastText: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
