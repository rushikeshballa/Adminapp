import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurants } from '../context/RestaurantContext';
import { MenuItemCard } from '../components/MenuItemCard';
import { Restaurant, MenuItem } from '../types';
import { theme } from '../theme/colors';

interface RestaurantDetailScreenProps {
  restaurant: Restaurant;
  onEditRestaurant: (restaurant: Restaurant) => void;
  onOpenAddMenuItem: () => void;
  onEditMenuItem: (item: MenuItem) => void;
}

export const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({
  restaurant,
  onEditRestaurant,
  onOpenAddMenuItem,
  onEditMenuItem,
}) => {
  const { setActiveRestaurantId } = useRestaurants();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dishSearch, setDishSearch] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [bestsellerOnly, setBestsellerOnly] = useState(false);

  const menu = restaurant.menu || [];

  // Extract unique categories in this restaurant's menu
  const uniqueCategories = ['All'];
  menu.forEach((item) => {
    if (item.category && !uniqueCategories.includes(item.category)) {
      uniqueCategories.push(item.category);
    }
  });

  // Filter dishes
  const filteredMenu = menu.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (dietaryFilter !== 'all' && item.dietary !== dietaryFilter) {
      return false;
    }
    if (bestsellerOnly && !item.bestseller) {
      return false;
    }
    if (dishSearch.trim()) {
      const q = dishSearch.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCombo = item.comboIncludes?.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchCombo) {
        return false;
      }
    }
    return true;
  });

  // Dish stats
  const totalDishes = menu.length;
  const vegCount = menu.filter((m) => m.dietary === 'veg').length;
  const nonVegCount = menu.filter((m) => m.dietary === 'non-veg').length;
  const bestsellersCount = menu.filter((m) => m.bestseller).length;
  const combosCount = menu.filter((m) => m.isCombo).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* 1. Hero Banner */}
      <View style={styles.heroWrapper}>
        <Image
          source={{ uri: restaurant.bannerImage || restaurant.featuredImage }}
          style={styles.heroBanner}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(10, 14, 23, 0.2)', 'rgba(10, 14, 23, 0.95)']}
          style={styles.heroOverlay}
        />

        <View style={styles.heroContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveRestaurantId(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={styles.backBtnText}>All Restaurants</Text>
          </TouchableOpacity>

          <View style={styles.headerInfoRow}>
            <View style={styles.avatarBox}>
              <Image
                source={{ uri: restaurant.featuredImage }}
                style={styles.avatarImg}
              />
            </View>

            <View style={styles.titleCol}>
              <View style={styles.nameRow}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                {restaurant.promoted && (
                  <View style={styles.promotedTag}>
                    <Ionicons name="sparkles" size={11} color="#F59E0B" />
                    <Text style={styles.promotedTagText}>PROMOTED</Text>
                  </View>
                )}
              </View>

              <Text style={styles.tagline}>{restaurant.tagline}</Text>
              <Text style={styles.address}>
                <Ionicons name="location-outline" size={13} color={theme.colors.textMuted} />{' '}
                {restaurant.address}
              </Text>
            </View>

            <View style={styles.heroActionBtns}>
              <TouchableOpacity
                style={styles.editRestoBtn}
                onPress={() => onEditRestaurant(restaurant)}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={16} color="#FFFFFF" />
                <Text style={styles.editRestoBtnText}>Edit Info</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addDishPrimaryBtn}
                onPress={onOpenAddMenuItem}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addDishPrimaryBtnText}>Add Menu Item</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.heroMetaBar}>
            <View style={styles.heroMetaItem}>
              <Ionicons name="star" size={15} color="#F59E0B" />
              <Text style={styles.heroRatingVal}>{restaurant.rating.toFixed(1)}</Text>
              <Text style={styles.heroMetaLabel}>({restaurant.totalRatings})</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroMetaItem}>
              <Ionicons name="time-outline" size={15} color={theme.colors.textSecondary} />
              <Text style={styles.heroMetaVal}>{restaurant.deliveryTime}</Text>
              <Text style={styles.heroMetaLabel}>Delivery</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroMetaItem}>
              <Ionicons name="navigate-outline" size={15} color={theme.colors.textSecondary} />
              <Text style={styles.heroMetaVal}>{restaurant.distance}</Text>
              <Text style={styles.heroMetaLabel}>Distance</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroMetaItem}>
              <Ionicons name="wallet-outline" size={15} color={theme.colors.textSecondary} />
              <Text style={styles.heroMetaVal}>₹{restaurant.costForTwo}</Text>
              <Text style={styles.heroMetaLabel}>For two</Text>
            </View>

            {Boolean(restaurant.couponCode) && (
              <>
                <View style={styles.heroDivider} />
                <View style={styles.couponBadge}>
                  <Ionicons name="ticket" size={14} color="#FBBF24" />
                  <Text style={styles.couponCodeText}>{restaurant.couponCode}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      {/* 2. Menu Statistics Strip */}
      <View style={styles.statsStrip}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{totalDishes}</Text>
          <Text style={styles.statLabel}>Total Dishes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: theme.colors.veg }]}>{vegCount}</Text>
          <Text style={styles.statLabel}>Vegetarian</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: theme.colors.nonVeg }]}>{nonVegCount}</Text>
          <Text style={styles.statLabel}>Non-Veg</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: '#F59E0B' }]}>{bestsellersCount}</Text>
          <Text style={styles.statLabel}>Bestsellers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: theme.colors.accent }]}>{combosCount}</Text>
          <Text style={styles.statLabel}>Combo Meals</Text>
        </View>
      </View>

      {/* 3. Search & Filter Bar */}
      <View style={styles.filterCard}>
        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={dishSearch}
            onChangeText={setDishSearch}
            placeholder="Search dish name, ingredients, combos..."
            placeholderTextColor={theme.colors.textMuted}
          />
          {Boolean(dishSearch) && (
            <TouchableOpacity onPress={() => setDishSearch('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Dietary & Bestseller pills */}
        <View style={styles.pillsRow}>
          <View style={styles.dietaryPills}>
            <TouchableOpacity
              style={[
                styles.pillBtn,
                dietaryFilter === 'all' && styles.pillBtnActive,
              ]}
              onPress={() => setDietaryFilter('all')}
            >
              <Text
                style={[
                  styles.pillBtnText,
                  dietaryFilter === 'all' && styles.pillBtnTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pillBtn,
                dietaryFilter === 'veg' && styles.vegActivePill,
              ]}
              onPress={() => setDietaryFilter('veg')}
            >
              <View style={[styles.miniDot, { backgroundColor: theme.colors.veg }]} />
              <Text
                style={[
                  styles.pillBtnText,
                  dietaryFilter === 'veg' && { color: theme.colors.veg, fontWeight: '700' },
                ]}
              >
                Veg ({vegCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pillBtn,
                dietaryFilter === 'non-veg' && styles.nonVegActivePill,
              ]}
              onPress={() => setDietaryFilter('non-veg')}
            >
              <View style={[styles.miniDot, { backgroundColor: theme.colors.nonVeg }]} />
              <Text
                style={[
                  styles.pillBtnText,
                  dietaryFilter === 'non-veg' && { color: theme.colors.nonVeg, fontWeight: '700' },
                ]}
              >
                Non-Veg ({nonVegCount})
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.pillBtn, bestsellerOnly && styles.bestsellerActivePill]}
            onPress={() => setBestsellerOnly(!bestsellerOnly)}
          >
            <Ionicons
              name="flame"
              size={13}
              color={bestsellerOnly ? '#F59E0B' : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.pillBtnText,
                bestsellerOnly && { color: '#F59E0B', fontWeight: '700' },
              ]}
            >
              Bestsellers Only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {uniqueCategories.map((cat) => {
            const count =
              cat === 'All'
                ? menu.length
                : menu.filter((m) => m.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryFilterChip,
                  isSelected && styles.categoryFilterChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryFilterText,
                    isSelected && styles.categoryFilterTextActive,
                  ]}
                >
                  {cat} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. Menu Items Section */}
      <View style={styles.menuHeaderRow}>
        <Text style={styles.menuSectionTitle}>
          {selectedCategory === 'All' ? 'Full Menu' : selectedCategory} ({filteredMenu.length})
        </Text>

        <TouchableOpacity
          style={styles.addDishSmallBtn}
          onPress={onOpenAddMenuItem}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.addDishSmallBtnText}>Add Dish</Text>
        </TouchableOpacity>
      </View>

      {filteredMenu.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="fast-food-outline" size={44} color={theme.colors.textMuted} />
          <Text style={styles.emptyTitle}>No dishes found</Text>
          <Text style={styles.emptySubtitle}>
            No menu items match your current filter settings in this category.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={onOpenAddMenuItem}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.emptyBtnText}>Add New Dish</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.menuGrid}>
          {filteredMenu.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              restaurantId={restaurant.id}
              onEdit={onEditMenuItem}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  contentContainer: {
    paddingBottom: 40,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  heroWrapper: {
    height: 280,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroBanner: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  avatarBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  titleCol: {
    flex: 1,
    minWidth: 220,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  promotedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
  },
  promotedTagText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  address: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  heroActionBtns: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  editRestoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: theme.radius.sm,
  },
  editRestoBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  addDishPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: theme.radius.sm,
  },
  addDishPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  heroMetaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    gap: 12,
    flexWrap: 'wrap',
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroRatingVal: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '700',
  },
  heroMetaVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  heroMetaLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  heroDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  couponBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  couponCodeText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '700',
  },
  statsStrip: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  statBox: {
    flex: 1,
    minWidth: 110,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: 12,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  filterCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 13,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietaryPills: {
    flexDirection: 'row',
    gap: 8,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pillBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: theme.colors.textPrimary,
  },
  vegActivePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: theme.colors.veg,
  },
  nonVegActivePill: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: theme.colors.nonVeg,
  },
  bestsellerActivePill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#F59E0B',
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillBtnText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  pillBtnTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoriesContent: {
    gap: 8,
  },
  categoryFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryFilterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryFilterText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  addDishSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
  },
  addDishSmallBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  menuGrid: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    marginHorizontal: 20,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    maxWidth: 320,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.radius.sm,
    marginTop: 6,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
