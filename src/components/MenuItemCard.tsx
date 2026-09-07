import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from '../types';
import { useRestaurants } from '../context/RestaurantContext';
import { theme } from '../theme/colors';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
  onEdit: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  restaurantId,
  onEdit,
}) => {
  const { deleteMenuItem, duplicateMenuItem } = useRestaurants();

  const isVeg = item.dietary === 'veg';

  const handleDelete = () => {
    const message = `Are you sure you want to remove "${item.name}" from the menu?`;
    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        deleteMenuItem(restaurantId, item.id);
      }
    } else {
      Alert.alert('Delete Menu Item', message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMenuItem(restaurantId, item.id) },
      ]);
    }
  };

  const discountPercent =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : null;

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        {/* Left column: Details */}
        <View style={styles.infoCol}>
          {/* Top row: Dietary indicator, Category, Bestseller */}
          <View style={styles.badgeRow}>
            {/* Standard Indian FSSAI Veg / Non-Veg icon */}
            <View
              style={[
                styles.vegIndicatorBox,
                { borderColor: isVeg ? theme.colors.veg : theme.colors.nonVeg },
              ]}
            >
              <View
                style={[
                  styles.vegIndicatorDot,
                  { backgroundColor: isVeg ? theme.colors.veg : theme.colors.nonVeg },
                ]}
              />
            </View>

            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{item.category}</Text>
            </View>

            {item.bestseller && (
              <View style={styles.bestsellerPill}>
                <Ionicons name="flame" size={12} color="#F59E0B" />
                <Text style={styles.bestsellerText}>BESTSELLER</Text>
              </View>
            )}

            {item.isCombo && (
              <View style={styles.comboPill}>
                <Ionicons name="layers" size={11} color="#818CF8" />
                <Text style={styles.comboPillText}>COMBO</Text>
              </View>
            )}
          </View>

          {/* Item Name */}
          <Text style={styles.itemName}>{item.name}</Text>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {Boolean(item.originalPrice) && (
              <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
            )}
            {discountPercent !== null && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountPercent}% OFF</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {Boolean(item.description) && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          {/* Combo Includes Pills */}
          {Boolean(item.isCombo && item.comboIncludes && item.comboIncludes.length > 0) && (
            <View style={styles.comboIncludesContainer}>
              <Text style={styles.comboIncludesLabel}>Includes:</Text>
              <View style={styles.comboChipsRow}>
                {item.comboIncludes?.map((subItem, idx) => (
                  <View key={idx} style={styles.comboChip}>
                    <Text style={styles.comboChipText}>• {subItem}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Attributes row: rating, prep time, calories, spicy level */}
          <View style={styles.attributesRow}>
            {item.rating !== undefined && (
              <View style={styles.attrItem}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.ratingText}>
                  {item.rating.toFixed(1)}{' '}
                  <Text style={styles.ratingCount}>({item.ratingCount || 0})</Text>
                </Text>
              </View>
            )}

            {Boolean(item.prepTime) && (
              <View style={styles.attrItem}>
                <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} />
                <Text style={styles.attrText}>{item.prepTime}</Text>
              </View>
            )}

            {Boolean(item.calories) && (
              <View style={styles.attrItem}>
                <Ionicons name="fitness-outline" size={12} color={theme.colors.textMuted} />
                <Text style={styles.attrText}>{item.calories} kcal</Text>
              </View>
            )}

            {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
              <View style={styles.attrItem}>
                <Text style={styles.spicyIcons}>
                  {'🌶️'.repeat(Math.min(item.spicyLevel, 3))}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Right column: Image & Action buttons */}
        <View style={styles.mediaCol}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          </View>

          {/* Action buttons under image */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => duplicateMenuItem(restaurantId, item.id)}
              accessibilityLabel="Duplicate Dish"
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={15} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => onEdit(item)}
              accessibilityLabel="Edit Dish"
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={15} color={theme.colors.accent} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={handleDelete}
              accessibilityLabel="Delete Dish"
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={15} color={theme.colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: 14,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  mainRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  infoCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  vegIndicatorBox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  vegIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  categoryPillText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  bestsellerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  bestsellerText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
  },
  comboPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  comboPillText: {
    color: '#A5B4FC',
    fontSize: 10,
    fontWeight: '700',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  originalPrice: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
  },
  discountText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
    marginBottom: 8,
  },
  comboIncludesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 8,
    borderRadius: theme.radius.sm,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  comboIncludesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  comboChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  comboChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
  },
  comboChipText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  attributesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  attrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FBBF24',
  },
  ratingCount: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '400',
  },
  attrText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  spicyIcons: {
    fontSize: 11,
  },
  mediaCol: {
    alignItems: 'center',
    width: 110,
  },
  imageWrapper: {
    width: 110,
    height: 95,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  editBtn: {
    backgroundColor: theme.colors.accentLight,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  deleteBtn: {
    backgroundColor: theme.colors.dangerLight,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
});
