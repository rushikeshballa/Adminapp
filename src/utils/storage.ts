import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restaurant } from '../types';
import { RESTAURANTS_DATA } from '../data/seedData';

const STORAGE_KEY = '@restaurant_admin_data_v1';

export const loadRestaurantsFromStorage = async (): Promise<Restaurant[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load restaurants from AsyncStorage, using fallback:', err);
  }
  return RESTAURANTS_DATA;
};

export const saveRestaurantsToStorage = async (data: Restaurant[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Failed to save restaurants to AsyncStorage:', err);
    return false;
  }
};

export const clearRestaurantsStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
};
