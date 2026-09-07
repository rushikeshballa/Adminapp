import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '../types';
import { useRestaurants } from '../context/RestaurantContext';
import { theme } from '../theme/colors';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onEdit,
  onSelect,
}) => {
  const { deleteRestaurant, duplicateRestaurant } = useRestaurants();

  const handleDelete = () => {
    const message = `Are you sure you want to delete "${restaurant.name}" and all its ${restaurant.menu?.length || 0} menu items?`;
    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        deleteRestaurant(restaurant.id);
      }
    } else {
      Alert.alert('Delete Restaurant', message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRestaurant(restaurant.id) },
      ]);
    }
  };

  const isPureVeg = restaurant.dietaryType === 'pure-veg';
  const menuCount = restaurant.menu?.length || 0;

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={restaurant.gradientColors || ['#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.cardContainer,
          { borderColor: restaurant.cardBorderColor || 'rgba(255,255,255,0.1)' },
        ]}
      >
        {/* Banner / Media header */}
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: restaurant.bannerImage || restaurant.featuredImage }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
            style={styles.bannerOverlay}
          />

          {/* Badges on top of banner */}
          <View style={styles.topBadgesRow}>
            {restaurant.promoted && (
              <View style={styles.promotedBadge}>
                <Ionicons name="sparkles" size={11} color="#F59E0B" />
                <Text style={styles.promotedBadgeText}>FEATURED</Text>
              </View>
            )}

            <View
              style={[
                styles.dietaryBadge,
                isPureVeg ? styles.pureVegBadge : styles.nonVegBadge,
              ]}
            >
              <View
                style={[
                  styles.dietaryDot,
                  { backgroundColor: isPureVeg ? theme.colors.veg : theme.colors.nonVeg },
                ]}
              />
              <Text
                style={[
                  styles.dietaryBadgeText,
                  { color: isPureVeg ? theme.colors.veg : theme.colors.nonVeg },
                ]}
              >
                {isPureVeg ? 'PURE VEG' : 'MULTI'}
              </Text>
            </View>
          </View>

          {/* Featured avatar / logo thumbnail */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: restaurant.featuredImage }}
              style={styles.avatarImage}
            />
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          <View style={styles.titleRatingRow}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.tagline} numberOfLines={2}>
            {restaurant.tagline}
          </Text>

          {/* Cuisine pills */}
          <View style={styles.cuisineRow}>
            {restaurant.cuisine?.map((item, idx) => (
              <View key={idx} style={styles.cuisinePill}>
                <Text style={styles.cuisinePillText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Logistics stats: Delivery, Distance, Cost */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{restaurant.distance}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="wallet-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>₹{restaurant.costForTwo} for two</Text>
            </View>
          </View>

          {/* Offer text banner if available */}
          {Boolean(restaurant.offerText) && (
            <View style={styles.offerBadge}>
              <Ionicons name="pricetag" size={12} color="#FBBF24" />
              <Text style={styles.offerText} numberOfLines={1}>
                {restaurant.offerText}
              </Text>
            </View>
          )}

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.manageBtn}
              onPress={() => onSelect(restaurant)}
              activeOpacity={0.8}
            >
              <Ionicons name="restaurant-outline" size={15} color="#FFFFFF" />
              <Text style={styles.manageBtnText}>
                Manage Menu ({menuCount})
              </Text>
            </TouchableOpacity>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => duplicateRestaurant(restaurant.id)}
                accessibilityLabel="Duplicate restaurant"
                activeOpacity={0.7}
              >
                <Ionicons name="copy-outline" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => onEdit(restaurant)}
                accessibilityLabel="Edit restaurant"
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={16} color={theme.colors.accent} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionIconBtn, styles.deleteActionBtn]}
                onPress={handleDelete}
                accessibilityLabel="Delete restaurant"
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    marginVertical: 8,
  },
  cardContainer: {
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  mediaContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: '#182234',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
  },
  topBadgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promotedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  promotedBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dietaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  pureVegBadge: {
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  nonVegBadge: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  dietaryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dietaryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -18,
    left: 16,
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  contentBody: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  titleRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  ratingText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },
  cuisineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  cuisinePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  cuisinePillText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  offerText: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  manageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    gap: 6,
  },
  manageBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
});
