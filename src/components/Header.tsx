import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurants } from '../context/RestaurantContext';
import { theme } from '../theme/colors';

interface HeaderProps {
  onOpenAddRestaurant: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddRestaurant,
  onOpenExportModal,
}) => {
  const {
    activeRestaurant,
    setActiveRestaurantId,
    resetToDefaultData,
    restaurants,
  } = useRestaurants();

  const handleReset = () => {
    const message = 'Are you sure you want to reset all restaurants to default seed data? Any new additions will be replaced.';
    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        resetToDefaultData();
      }
    } else {
      Alert.alert('Reset Data', message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetToDefaultData },
      ]);
    }
  };

  const totalMenuItems = restaurants.reduce((acc, r) => acc + (r.menu?.length || 0), 0);

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {activeRestaurant ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setActiveRestaurantId(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.backText}>All Restaurants</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.brandContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="restaurant" size={20} color="#10B981" />
            </View>
            <View>
              <Text style={styles.brandTitle}>RestoHub Admin</Text>
              <Text style={styles.brandSubtitle}>
                {restaurants.length} Restaurants • {totalMenuItems} Dishes
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.btn, styles.secondaryBtn]}
          onPress={onOpenExportModal}
          activeOpacity={0.7}
        >
          <Ionicons name="code-slash" size={16} color={theme.colors.accent} />
          <Text style={[styles.btnText, { color: theme.colors.accent }]}>Data Hub</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.iconBtn]}
          onPress={handleReset}
          accessibilityLabel="Reset to default seed data"
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.primaryBtn]}
          onPress={onOpenAddRestaurant}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>Add Restaurant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
    flexWrap: 'wrap',
    gap: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    gap: 6,
  },
  backText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radius.sm,
    gap: 6,
  },
  secondaryBtn: {
    backgroundColor: theme.colors.accentLight,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  iconBtn: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
