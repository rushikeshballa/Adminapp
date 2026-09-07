import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurants } from '../context/RestaurantContext';
import { RestaurantCard } from '../components/RestaurantCard';
import { Restaurant } from '../types';
import { theme } from '../theme/colors';

interface DashboardScreenProps {
  onOpenAddRestaurant: () => void;
  onEditRestaurant: (restaurant: Restaurant) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onOpenAddRestaurant,
  onEditRestaurant,
}) => {
  const {
    restaurants,
    isLoading,
    setActiveRestaurantId,
    searchQuery,
    setSearchQuery,
    selectedCuisine,
    setSelectedCuisine,
    dietaryFilter,
    setDietaryFilter,
    promotedFilter,
    setPromotedFilter,
  } = useRestaurants();

  // Metrics calculations
  const totalRestaurants = restaurants.length;
  const totalDishes = restaurants.reduce((acc, r) => acc + (r.menu?.length || 0), 0);
  const pureVegCount = restaurants.filter((r) => r.dietaryType === 'pure-veg').length;
  const avgRating =
    totalRestaurants > 0
      ? (
          restaurants.reduce((acc, r) => acc + r.rating, 0) / totalRestaurants
        ).toFixed(1)
      : '0.0';
  const promotedCount = restaurants.filter((r) => r.promoted).length;

  // Extract all unique cuisines across restaurants
  const allCuisines = ['All'];
  restaurants.forEach((r) => {
    r.cuisine?.forEach((c) => {
      const clean = c.trim();
      if (!allCuisines.includes(clean)) {
        allCuisines.push(clean);
      }
    });
  });

  // Filter logic
  const filteredRestaurants = restaurants.filter((r) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchTagline = r.tagline.toLowerCase().includes(q);
      const matchAddress = r.address.toLowerCase().includes(q);
      const matchCuisine = r.cuisine?.some((c) => c.toLowerCase().includes(q));
      const matchDishes = r.menu?.some((m) => m.name.toLowerCase().includes(q));
      if (!matchName && !matchTagline && !matchAddress && !matchCuisine && !matchDishes) {
        return false;
      }
    }

    // Cuisine filter
    if (selectedCuisine !== 'All') {
      if (!r.cuisine?.includes(selectedCuisine)) {
        return false;
      }
    }

    // Dietary filter
    if (dietaryFilter === 'pure-veg' && r.dietaryType !== 'pure-veg') {
      return false;
    }
    if (dietaryFilter === 'non-veg' && r.dietaryType === 'pure-veg') {
      return false;
    }

    // Promoted filter
    if (promotedFilter && !r.promoted) {
      return false;
    }

    return true;
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading restaurant database...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* 1. Top Metrics KPI Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
            <Ionicons name="storefront" size={20} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.metricValue}>{totalRestaurants}</Text>
            <Text style={styles.metricLabel}>Restaurants</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
            <Ionicons name="fast-food" size={20} color={theme.colors.accent} />
          </View>
          <View>
            <Text style={styles.metricValue}>{totalDishes}</Text>
            <Text style={styles.metricLabel}>Menu Items</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
            <Ionicons name="star" size={20} color={theme.colors.warning} />
          </View>
          <View>
            <Text style={styles.metricValue}>{avgRating} ★</Text>
            <Text style={styles.metricLabel}>Avg. Rating</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.12)' }]}>
            <Ionicons name="sparkles" size={20} color="#EC4899" />
          </View>
          <View>
            <Text style={styles.metricValue}>{promotedCount}</Text>
            <Text style={styles.metricLabel}>Promoted</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: 'rgba(52, 211, 153, 0.12)' }]}>
            <Ionicons name="leaf" size={20} color="#34D399" />
          </View>
          <View>
            <Text style={styles.metricValue}>{pureVegCount}</Text>
            <Text style={styles.metricLabel}>Pure Veg</Text>
          </View>
        </View>
      </View>

      {/* 2. Search & Filters Bar */}
      <View style={styles.filterSection}>
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search restaurants, cuisines, locations, or dishes..."
            placeholderTextColor={theme.colors.textMuted}
          />
          {Boolean(searchQuery) && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Dietary & Promoted Switches */}
        <View style={styles.pillsRow}>
          {/* Dietary Selector */}
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
                All Dietary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pillBtn,
                dietaryFilter === 'pure-veg' && styles.pureVegPillActive,
              ]}
              onPress={() => setDietaryFilter('pure-veg')}
            >
              <View style={[styles.miniDot, { backgroundColor: theme.colors.veg }]} />
              <Text
                style={[
                  styles.pillBtnText,
                  dietaryFilter === 'pure-veg' && { color: theme.colors.veg, fontWeight: '700' },
                ]}
              >
                Pure Veg
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pillBtn,
                dietaryFilter === 'non-veg' && styles.nonVegPillActive,
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
                Non-Veg
              </Text>
            </TouchableOpacity>
          </View>

          {/* Promoted Toggle Pill */}
          <TouchableOpacity
            style={[
              styles.pillBtn,
              promotedFilter && styles.promotedPillActive,
            ]}
            onPress={() => setPromotedFilter(!promotedFilter)}
          >
            <Ionicons
              name={promotedFilter ? 'star' : 'star-outline'}
              size={13}
              color={promotedFilter ? '#FBBF24' : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.pillBtnText,
                promotedFilter && { color: '#FBBF24', fontWeight: '700' },
              ]}
            >
              Promoted Only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cuisine Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cuisinesScroll}
          contentContainerStyle={styles.cuisinesContent}
        >
          {allCuisines.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.cuisineFilterChip,
                selectedCuisine === c && styles.cuisineFilterChipActive,
              ]}
              onPress={() => setSelectedCuisine(c)}
            >
              <Text
                style={[
                  styles.cuisineFilterText,
                  selectedCuisine === c && styles.cuisineFilterTextActive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Section Title & Results Count */}
      <View style={styles.resultsHeaderRow}>
        <Text style={styles.resultsTitle}>
          Restaurants ({filteredRestaurants.length})
        </Text>

        {(Boolean(searchQuery) ||
          selectedCuisine !== 'All' ||
          dietaryFilter !== 'all' ||
          promotedFilter) && (
          <TouchableOpacity
            style={styles.clearFiltersBtn}
            onPress={() => {
              setSearchQuery('');
              setSelectedCuisine('All');
              setDietaryFilter('all');
              setPromotedFilter(false);
            }}
          >
            <Ionicons name="refresh" size={13} color={theme.colors.primary} />
            <Text style={styles.clearFiltersText}>Reset Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 4. Restaurants Grid / List */}
      {filteredRestaurants.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="search-outline" size={48} color={theme.colors.textMuted} />
          <Text style={styles.emptyStateTitle}>No restaurants found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try changing search terms or clearing dietary and cuisine filters.
          </Text>
          <TouchableOpacity
            style={styles.emptyActionBtn}
            onPress={onOpenAddRestaurant}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.emptyActionBtnText}>Add New Restaurant</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardsGrid}>
          {filteredRestaurants.map((resto) => (
            <RestaurantCard
              key={resto.id}
              restaurant={resto}
              onEdit={onEditRestaurant}
              onSelect={(r) => setActiveRestaurantId(r.id)}
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
    padding: 20,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg,
    gap: 12,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  filterSection: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: 16,
    marginBottom: 20,
    gap: 14,
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
    fontSize: 14,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  dietaryPills: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pillBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: theme.colors.textPrimary,
  },
  pureVegPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: theme.colors.veg,
  },
  nonVegPillActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: theme.colors.nonVeg,
  },
  promotedPillActive: {
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
  cuisinesScroll: {
    flexDirection: 'row',
  },
  cuisinesContent: {
    gap: 8,
    alignItems: 'center',
  },
  cuisineFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cuisineFilterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  cuisineFilterText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  cuisineFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: 0.3,
  },
  clearFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.primaryLight,
  },
  clearFiltersText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  cardsGrid: {
    gap: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginTop: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    maxWidth: 400,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radius.sm,
    marginTop: 8,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
