import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '../types';
import { useRestaurants } from '../context/RestaurantContext';
import { theme, GRADIENT_PRESETS, RESTAURANT_BANNER_PRESETS } from '../theme/colors';
import { ImageUploader } from './ImageUploader';

interface RestaurantModalProps {
  visible: boolean;
  onClose: () => void;
  restaurantToEdit?: Restaurant | null;
}

const COMMON_CUISINES = [
  'Multi-cuisine',
  'South India',
  'North Indian',
  'Biryani',
  'Italian',
  'Chinese',
  'Asian',
  'Continental',
  'Fast Food',
  'Seafood',
  'Desserts',
];

export const RestaurantModal: React.FC<RestaurantModalProps> = ({
  visible,
  onClose,
  restaurantToEdit,
}) => {
  const { addRestaurant, updateRestaurant } = useRestaurants();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [address, setAddress] = useState('');
  const [cuisines, setCuisines] = useState<string[]>(['Multi-cuisine']);
  const [customCuisine, setCustomCuisine] = useState('');
  const [rating, setRating] = useState('4.5');
  const [totalRatings, setTotalRatings] = useState('1.2k+ ratings');
  const [deliveryTime, setDeliveryTime] = useState('20-25 mins');
  const [deliveryMins, setDeliveryMins] = useState('25');
  const [distance, setDistance] = useState('2.5 km');
  const [costForTwo, setCostForTwo] = useState('400');
  const [dietaryType, setDietaryType] = useState<'pure-veg' | 'non-veg' | 'veg'>('non-veg');
  const [promoted, setPromoted] = useState(false);
  const [offerText, setOfferText] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [gradientColors, setGradientColors] = useState<[string, string]>(['#14345c', '#091526']);
  const [cardBorderColor, setCardBorderColor] = useState('rgba(62, 124, 177, 0.4)');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  );
  const [bannerImage, setBannerImage] = useState(
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
  );

  useEffect(() => {
    if (restaurantToEdit) {
      setName(restaurantToEdit.name);
      setTagline(restaurantToEdit.tagline);
      setAddress(restaurantToEdit.address);
      setCuisines(restaurantToEdit.cuisine || []);
      setRating(restaurantToEdit.rating.toString());
      setTotalRatings(restaurantToEdit.totalRatings || '1k+ ratings');
      setDeliveryTime(restaurantToEdit.deliveryTime);
      setDeliveryMins(restaurantToEdit.deliveryMins?.toString() || '25');
      setDistance(restaurantToEdit.distance);
      setCostForTwo(restaurantToEdit.costForTwo?.toString() || '400');
      setDietaryType(restaurantToEdit.dietaryType || 'non-veg');
      setPromoted(restaurantToEdit.promoted || false);
      setOfferText(restaurantToEdit.offerText || '');
      setCouponCode(restaurantToEdit.couponCode || '');
      setGradientColors(restaurantToEdit.gradientColors || ['#14345c', '#091526']);
      setCardBorderColor(restaurantToEdit.cardBorderColor || 'rgba(62, 124, 177, 0.4)');
      setFeaturedImage(restaurantToEdit.featuredImage || '');
      setBannerImage(restaurantToEdit.bannerImage || '');
    } else {
      // Defaults for new restaurant
      setName('');
      setTagline('');
      setAddress('Jubilee Hills, Hyderabad');
      setCuisines(['Multi-cuisine']);
      setRating('4.6');
      setTotalRatings('2.5k+ ratings');
      setDeliveryTime('25-30 mins');
      setDeliveryMins('28');
      setDistance('2.8 km');
      setCostForTwo('450');
      setDietaryType('non-veg');
      setPromoted(true);
      setOfferText('40% OFF up to ₹100 | Code WELCOME40');
      setCouponCode('WELCOME40');
      setGradientColors(['#173a2b', '#0a1812']);
      setCardBorderColor('rgba(76, 154, 106, 0.4)');
      setFeaturedImage(
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
      );
      setBannerImage(
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
      );
    }
  }, [restaurantToEdit, visible]);

  const toggleCuisine = (item: string) => {
    if (cuisines.includes(item)) {
      setCuisines(cuisines.filter((c) => c !== item));
    } else {
      setCuisines([...cuisines, item]);
    }
  };

  const addCustomCuisine = () => {
    if (customCuisine.trim() && !cuisines.includes(customCuisine.trim())) {
      setCuisines([...cuisines, customCuisine.trim()]);
      setCustomCuisine('');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Restaurant Name is required');
      return;
    }

    const payload: Restaurant = {
      id: restaurantToEdit
        ? restaurantToEdit.id
        : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
          `-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      tagline: tagline.trim() || `${name} is a premier dining destination in the city.`,
      address: address.trim() || 'Hyderabad',
      cuisine: cuisines.length > 0 ? cuisines : ['Multi-cuisine'],
      rating: parseFloat(rating) || 4.5,
      totalRatings: totalRatings.trim() || '1.0k+ ratings',
      deliveryTime: deliveryTime.trim() || '25-30 mins',
      deliveryMins: parseInt(deliveryMins, 10) || 25,
      distance: distance.trim() || '2.5 km',
      costForTwo: parseInt(costForTwo, 10) || 400,
      dietaryType,
      promoted,
      offerText: offerText.trim() || undefined,
      couponCode: couponCode.trim() || undefined,
      gradientColors,
      cardBorderColor,
      featuredImage: featuredImage.trim(),
      bannerImage: bannerImage.trim(),
      menu: restaurantToEdit?.menu || [],
    };

    if (restaurantToEdit) {
      updateRestaurant(restaurantToEdit.id, payload);
    } else {
      addRestaurant(payload);
    }

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>
                {restaurantToEdit ? 'Edit Restaurant' : 'Add New Restaurant'}
              </Text>
              <Text style={styles.modalSubtitle}>
                Fill in restaurant profile, branding theme, and delivery settings
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form Scroll Area */}
          <ScrollView style={styles.formScroll} contentContainerStyle={styles.formContent}>
            {/* Section 1: General Info */}
            <Text style={styles.sectionHeader}>1. Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Restaurant Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Royal Nawabs"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tagline / Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={tagline}
                onChangeText={setTagline}
                placeholder="Brief summary of specialty and cuisine heritage..."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Address / Location</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="e.g. Banjara Hills, Road No. 10, Hyderabad"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Dietary Specialty</Text>
                <View style={styles.segmentedRow}>
                  {(['pure-veg', 'non-veg'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.segmentBtn,
                        dietaryType === type && styles.segmentBtnActive,
                        dietaryType === type && {
                          borderColor: type === 'pure-veg' ? theme.colors.veg : theme.colors.nonVeg,
                        },
                      ]}
                      onPress={() => setDietaryType(type)}
                    >
                      <View
                        style={[
                          styles.segmentDot,
                          {
                            backgroundColor:
                              type === 'pure-veg' ? theme.colors.veg : theme.colors.nonVeg,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.segmentText,
                          dietaryType === type && styles.segmentTextActive,
                        ]}
                      >
                        {type === 'pure-veg' ? 'Pure Veg' : 'Non-Veg / Mixed'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Cost For Two (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={costForTwo}
                  onChangeText={setCostForTwo}
                  keyboardType="numeric"
                  placeholder="350"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </View>

            {/* Section 2: Cuisines */}
            <Text style={styles.sectionHeader}>2. Cuisines & Tags</Text>
            <View style={styles.cuisineChipsContainer}>
              {COMMON_CUISINES.map((item) => {
                const isSelected = cuisines.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.cuisineSelectChip, isSelected && styles.cuisineChipSelected]}
                    onPress={() => toggleCuisine(item)}
                  >
                    <Text
                      style={[
                        styles.cuisineChipText,
                        isSelected && styles.cuisineChipTextSelected,
                      ]}
                    >
                      {item} {isSelected ? '✓' : '+'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.customCuisineRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={customCuisine}
                onChangeText={setCustomCuisine}
                placeholder="Add custom cuisine tag..."
                placeholderTextColor={theme.colors.textMuted}
                onSubmitEditing={addCustomCuisine}
              />
              <TouchableOpacity style={styles.addTagBtn} onPress={addCustomCuisine}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Section 3: Delivery & Ratings */}
            <Text style={styles.sectionHeader}>3. Logistics & Ratings</Text>
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Delivery Time</Text>
                <TextInput
                  style={styles.input}
                  value={deliveryTime}
                  onChangeText={setDeliveryTime}
                  placeholder="20-25 mins"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Est. Minutes (Numeric)</Text>
                <TextInput
                  style={styles.input}
                  value={deliveryMins}
                  onChangeText={setDeliveryMins}
                  keyboardType="numeric"
                  placeholder="22"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Distance</Text>
                <TextInput
                  style={styles.input}
                  value={distance}
                  onChangeText={setDistance}
                  placeholder="2.1 km"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Rating (0 - 5.0)</Text>
                <TextInput
                  style={styles.input}
                  value={rating}
                  onChangeText={setRating}
                  keyboardType="numeric"
                  placeholder="4.7"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Total Ratings Text</Text>
                <TextInput
                  style={styles.input}
                  value={totalRatings}
                  onChangeText={setTotalRatings}
                  placeholder="3.8k+ ratings"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </View>

            {/* Section 4: Promotions & Offers */}
            <Text style={styles.sectionHeader}>4. Promotions & Offers</Text>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Feature / Promote on Feed</Text>
                <Text style={styles.switchDesc}>Displays featured badge and top highlight</Text>
              </View>
              <Switch
                value={promoted}
                onValueChange={setPromoted}
                trackColor={{ false: '#374151', true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.inputLabel}>Offer Text Banner</Text>
                <TextInput
                  style={styles.input}
                  value={offerText}
                  onChangeText={setOfferText}
                  placeholder="e.g. 50% OFF up to ₹100 | Code KRISHNNA50"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Coupon Code</Text>
                <TextInput
                  style={styles.input}
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder="KRISHNNA50"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Section 5: Branding & Gradient Colors */}
            <Text style={styles.sectionHeader}>5. Visual Theme & Colors</Text>
            <Text style={styles.subHint}>
              Select a luxury gradient theme preset or customize card border
            </Text>

            <View style={styles.presetGrid}>
              {GRADIENT_PRESETS.map((preset, idx) => {
                const isSelected =
                  gradientColors[0] === preset.colors[0] &&
                  gradientColors[1] === preset.colors[1];
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.presetCard,
                      isSelected && styles.presetCardSelected,
                    ]}
                    onPress={() => {
                      setGradientColors(preset.colors);
                      setCardBorderColor(preset.border);
                    }}
                  >
                    <View
                      style={[
                        styles.presetPreview,
                        {
                          backgroundColor: preset.colors[0],
                          borderColor: preset.border,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.presetName,
                        isSelected && { color: theme.colors.primary, fontWeight: '700' },
                      ]}
                    >
                      {preset.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Hex Inputs */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Gradient Color 1 (Hex)</Text>
                <TextInput
                  style={styles.input}
                  value={gradientColors[0]}
                  onChangeText={(val) => setGradientColors([val, gradientColors[1]])}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Gradient Color 2 (Hex)</Text>
                <TextInput
                  style={styles.input}
                  value={gradientColors[1]}
                  onChangeText={(val) => setGradientColors([gradientColors[0], val])}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Border Color (RGBA)</Text>
                <TextInput
                  style={styles.input}
                  value={cardBorderColor}
                  onChangeText={setCardBorderColor}
                />
              </View>
            </View>

            {/* Section 6: Upload Images & Media */}
            <Text style={styles.sectionHeader}>6. Upload Images & Media</Text>

            <ImageUploader
              label="Featured Logo / Avatar Image"
              hint="Upload square brand logo or dish icon"
              value={featuredImage}
              onChangeImage={setFeaturedImage}
              aspectRatio={[1, 1]}
              previewHeight={140}
            />

            <ImageUploader
              label="Banner Cover Image"
              hint="Upload wide cover photo displayed on restaurant card"
              value={bannerImage}
              onChangeImage={setBannerImage}
              aspectRatio={[16, 9]}
              presets={RESTAURANT_BANNER_PRESETS}
              previewHeight={160}
            />

            {/* Live Media Preview */}
            <View style={styles.previewBox}>
              <Text style={styles.previewLabel}>Card Media Live Preview:</Text>
              <View style={styles.previewFrame}>
                <Image
                  source={{ uri: bannerImage || featuredImage }}
                  style={styles.previewBannerImg}
                />
                <View style={styles.previewAvatarFrame}>
                  <Image source={{ uri: featuredImage }} style={styles.previewAvatarImg} />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>
                {restaurantToEdit ? 'Save Changes' : 'Create Restaurant'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '92%',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  formScroll: {
    paddingHorizontal: 20,
  },
  formContent: {
    paddingVertical: 16,
    gap: 12,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  subHint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.textPrimary,
    fontSize: 13,
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  segmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  segmentText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  cuisineChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuisineSelectChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  cuisineChipSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  cuisineChipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  cuisineChipTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  customCuisineRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addTagBtn: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  switchDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 140,
  },
  presetCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  presetPreview: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  presetName: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  bannerPresetsRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  bannerPresetChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    marginRight: 6,
  },
  bannerPresetText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  previewBox: {
    marginTop: 8,
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  previewFrame: {
    height: 110,
    width: '100%',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  previewBannerImg: {
    width: '100%',
    height: '100%',
  },
  previewAvatarFrame: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  previewAvatarImg: {
    width: '100%',
    height: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.radius.sm,
  },
  cancelBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.radius.sm,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
