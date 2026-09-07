import React, { createContext, useContext, useState, useEffect } from 'react';
import { Restaurant, MenuItem } from '../types';
import { RESTAURANTS_DATA } from '../data/seedData';
import { loadRestaurantsFromStorage, saveRestaurantsToStorage } from '../utils/storage';

interface ToastInfo {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  isLoading: boolean;
  activeRestaurant: Restaurant | null;
  activeRestaurantId: string | null;
  setActiveRestaurantId: (id: string | null) => void;
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCuisine: string;
  setSelectedCuisine: (c: string) => void;
  dietaryFilter: 'all' | 'pure-veg' | 'non-veg';
  setDietaryFilter: (d: 'all' | 'pure-veg' | 'non-veg') => void;
  promotedFilter: boolean;
  setPromotedFilter: (p: boolean) => void;

  // CRUD Operations
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, updated: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  duplicateRestaurant: (id: string) => void;

  addMenuItem: (restaurantId: string, item: MenuItem) => void;
  updateMenuItem: (restaurantId: string, itemId: string, updated: Partial<MenuItem>) => void;
  deleteMenuItem: (restaurantId: string, itemId: string) => void;
  duplicateMenuItem: (restaurantId: string, itemId: string) => void;

  resetToDefaultData: () => void;
  importRestaurants: (data: Restaurant[]) => boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'pure-veg' | 'non-veg'>('all');
  const [promotedFilter, setPromotedFilter] = useState(false);

  // Load Initial Data
  useEffect(() => {
    let isMounted = true;
    loadRestaurantsFromStorage().then((data) => {
      if (isMounted) {
        setRestaurants(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to storage on modification (after initial load)
  useEffect(() => {
    if (!isLoading && restaurants.length > 0) {
      saveRestaurantsToStorage(restaurants);
    }
  }, [restaurants, isLoading]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3200);
  };

  const hideToast = () => setToast(null);

  const activeRestaurant = restaurants.find((r) => r.id === activeRestaurantId) || null;

  // Restaurant CRUD
  const addRestaurant = (restaurant: Restaurant) => {
    setRestaurants((prev) => [restaurant, ...prev]);
    showToast(`Restaurant "${restaurant.name}" created successfully!`, 'success');
  };

  const updateRestaurant = (id: string, updated: Partial<Restaurant>) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
    showToast('Restaurant updated successfully!', 'success');
  };

  const deleteRestaurant = (id: string) => {
    const name = restaurants.find((r) => r.id === id)?.name || 'Restaurant';
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    if (activeRestaurantId === id) {
      setActiveRestaurantId(null);
    }
    showToast(`"${name}" removed`, 'info');
  };

  const duplicateRestaurant = (id: string) => {
    const original = restaurants.find((r) => r.id === id);
    if (!original) return;

    const copyId = `${original.id}-copy-${Date.now().toString().slice(-4)}`;
    const copy: Restaurant = {
      ...original,
      id: copyId,
      name: `${original.name} (Copy)`,
      menu: original.menu.map((m) => ({
        ...m,
        id: `${m.id}-${Date.now().toString().slice(-3)}`,
      })),
    };

    setRestaurants((prev) => [copy, ...prev]);
    showToast(`Duplicated as "${copy.name}"`, 'success');
  };

  // Menu Item CRUD
  const addMenuItem = (restaurantId: string, item: MenuItem) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          return {
            ...r,
            menu: [item, ...r.menu],
          };
        }
        return r;
      })
    );
    showToast(`Dish "${item.name}" added to menu!`, 'success');
  };

  const updateMenuItem = (restaurantId: string, itemId: string, updated: Partial<MenuItem>) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          return {
            ...r,
            menu: r.menu.map((m) => (m.id === itemId ? { ...m, ...updated } : m)),
          };
        }
        return r;
      })
    );
    showToast('Dish updated successfully!', 'success');
  };

  const deleteMenuItem = (restaurantId: string, itemId: string) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          const item = r.menu.find((m) => m.id === itemId);
          return {
            ...r,
            menu: r.menu.filter((m) => m.id !== itemId),
          };
        }
        return r;
      })
    );
    showToast('Dish removed from menu', 'info');
  };

  const duplicateMenuItem = (restaurantId: string, itemId: string) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          const original = r.menu.find((m) => m.id === itemId);
          if (!original) return r;
          const copy: MenuItem = {
            ...original,
            id: `${original.id}-copy-${Date.now().toString().slice(-3)}`,
            name: `${original.name} (Copy)`,
          };
          return {
            ...r,
            menu: [copy, ...r.menu],
          };
        }
        return r;
      })
    );
    showToast('Menu item duplicated!', 'success');
  };

  const resetToDefaultData = () => {
    setRestaurants(RESTAURANTS_DATA);
    saveRestaurantsToStorage(RESTAURANTS_DATA);
    setActiveRestaurantId(null);
    showToast('Restored all restaurants to initial seed data', 'info');
  };

  const importRestaurants = (data: Restaurant[]): boolean => {
    if (!Array.isArray(data) || data.length === 0) {
      showToast('Invalid data: Must be a non-empty array of restaurants', 'error');
      return false;
    }
    // Basic validation
    const valid = data.every((r) => r.id && r.name && Array.isArray(r.menu));
    if (!valid) {
      showToast('Invalid format: Each restaurant must have id, name, and menu array', 'error');
      return false;
    }

    setRestaurants(data);
    saveRestaurantsToStorage(data);
    showToast(`Successfully imported ${data.length} restaurants!`, 'success');
    return true;
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        isLoading,
        activeRestaurant,
        activeRestaurantId,
        setActiveRestaurantId,
        toast,
        showToast,
        hideToast,
        searchQuery,
        setSearchQuery,
        selectedCuisine,
        setSelectedCuisine,
        dietaryFilter,
        setDietaryFilter,
        promotedFilter,
        setPromotedFilter,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        duplicateRestaurant,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        duplicateMenuItem,
        resetToDefaultData,
        importRestaurants,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurants = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurants must be used within a RestaurantProvider');
  }
  return context;
};
