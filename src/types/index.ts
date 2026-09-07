export interface MenuItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating?: number;
  ratingCount?: number;
  dietary: 'veg' | 'non-veg';
  prepTime: string;
  category: string;
  isCombo?: boolean;
  comboIncludes?: string[];
  bestseller?: boolean;
  spicyLevel?: number; // 0, 1, 2, 3
  calories?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  totalRatings: string;
  deliveryTime: string;
  deliveryMins: number;
  distance: string;
  costForTwo: number;
  dietaryType: 'pure-veg' | 'non-veg' | 'veg';
  address: string;
  promoted: boolean;
  offerText?: string;
  couponCode?: string;
  gradientColors: [string, string];
  cardBorderColor: string;
  featuredImage: string;
  bannerImage: string;
  menu: MenuItem[];
}

export type CategoryOption = 'Combos' | 'Starters' | 'Main Course' | 'Desserts & Drinks' | string;
