export const theme = {
  colors: {
    bg: '#0A0E17',
    cardBg: '#111827',
    cardBorder: '#1F293D',
    cardHover: '#162032',
    surface: '#1A2234',
    surfaceLight: '#242F46',
    
    // Text
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    
    // Accents
    primary: '#10B981', // Emerald vibrant
    primaryHover: '#059669',
    primaryLight: 'rgba(16, 185, 129, 0.15)',
    
    accent: '#6366F1', // Indigo
    accentLight: 'rgba(99, 102, 241, 0.15)',
    
    warning: '#F59E0B', // Amber
    warningLight: 'rgba(245, 158, 11, 0.15)',
    
    danger: '#EF4444', // Red
    dangerLight: 'rgba(239, 68, 68, 0.15)',
    
    veg: '#10B981',
    nonVeg: '#EF4444',
    
    border: '#2A364F',
    borderLight: '#374151',
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
  },
};

export const GRADIENT_PRESETS = [
  { name: 'Emerald Forest', colors: ['#173a2b', '#0a1812'] as [string, string], border: 'rgba(76, 154, 106, 0.4)' },
  { name: 'Deep Ocean', colors: ['#14345c', '#091526'] as [string, string], border: 'rgba(62, 124, 177, 0.4)' },
  { name: 'Fiery Italian', colors: ['#4e221f', '#1b0907'] as [string, string], border: 'rgba(232, 115, 74, 0.4)' },
  { name: 'Royal Velvet', colors: ['#3a1d4f', '#150a1e'] as [string, string], border: 'rgba(139, 108, 201, 0.4)' },
  { name: 'Golden Spice', colors: ['#4a360d', '#1a1203'] as [string, string], border: 'rgba(201, 162, 39, 0.4)' },
  { name: 'Crimson Silk', colors: ['#44162e', '#190610'] as [string, string], border: 'rgba(201, 85, 122, 0.4)' },
  { name: 'Midnight Violet', colors: ['#281745', '#0e081c'] as [string, string], border: 'rgba(147, 95, 230, 0.4)' },
  { name: 'Amber Dusk', colors: ['#4b2a0c', '#180d04'] as [string, string], border: 'rgba(234, 138, 48, 0.4)' },
];

export const FOOD_IMAGE_PRESETS = [
  { label: 'Royal Thali', url: 'https://i.pinimg.com/736x/44/14/e5/4414e5901cb9cb3dd041448a6eeee467.jpg' },
  { label: 'Paneer Tikka', url: 'https://i.pinimg.com/1200x/cf/15/78/cf1578e2162c35af94caaa6e5454255d.jpg' },
  { label: 'Dum Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Butter Chicken', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gourmet Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dimsums', url: 'https://i.pinimg.com/736x/84/2e/4a/842e4a9ad7cabe4ebcf5a7fd703f357e.jpg' },
  { label: 'Noodles', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fish Fry', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lava Cake', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Garlic Bread', url: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=800&q=80' },
];

export const RESTAURANT_BANNER_PRESETS = [
  { label: 'Luxury Dining', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Indian Feast', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Bistro', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Coastal Seafood', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Italian Trattoria', url: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pan-Asian Lounge', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80' },
];
