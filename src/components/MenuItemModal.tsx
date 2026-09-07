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
import { MenuItem } from '../types';
import { useRestaurants } from '../context/RestaurantContext';
import { theme, FOOD_IMAGE_PRESETS } from '../theme/colors';
import { ImageUploader } from './ImageUploader';

interface MenuItemModalProps {
  visible: boolean;
  onClose: () => void;
  restaurantId: string;
  itemToEdit?: MenuItem | null;
}

const DEFAULT_CATEGORIES = ['Combos', 'Starters', 'Main Course', 'Desserts & Drinks'];

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  visible,
  onClose,
  restaurantId,
  itemToEdit,
}) => {
  const { addMenuItem, updateMenuItem } = useRestaurants();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  );
  const [rating, setRating] = useState('4.8');
  const [ratingCount, setRatingCount] = useState('850');
  const [dietary, setDietary] = useState<'veg' | 'non-veg'>('veg');
  const [prepTime, setPrepTime] = useState('18 mins');
  const [calories, setCalories] = useState('550');
  const [bestseller, setBestseller] = useState(false);
  const [spicyLevel, setSpicyLevel] = useState<number>(1);
  const [isCombo, setIsCombo] = useState(false);
  const [comboIncludes, setComboIncludes] = useState<string[]>([]);
  const [newComboItem, setNewComboItem] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setPrice(itemToEdit.price.toString());
      setOriginalPrice(itemToEdit.originalPrice ? itemToEdit.originalPrice.toString() : '');
      setDescription(itemToEdit.description);
      setImage(itemToEdit.image);
      setRating(itemToEdit.rating !== undefined ? itemToEdit.rating.toString() : '4.8');
      setRatingCount(itemToEdit.ratingCount ? itemToEdit.ratingCount.toString() : '500');
      setDietary(itemToEdit.dietary);
      setPrepTime(itemToEdit.prepTime);
      setCalories(itemToEdit.calories ? itemToEdit.calories.toString() : '500');
      setBestseller(itemToEdit.bestseller || false);
      setSpicyLevel(itemToEdit.spicyLevel !== undefined ? itemToEdit.spicyLevel : 1);
      setIsCombo(itemToEdit.isCombo || false);
      setComboIncludes(itemToEdit.comboIncludes || []);
    } else {
      // Default new dish
      setName('');
      setCategory('Combos');
      setPrice('299');
      setOriginalPrice('380');
      setDescription('Signature chef preparation made with authentic spices and fresh herbs.');
      setImage(
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
      );
      setRating('4.8');
      setRatingCount('450');
      setDietary('veg');
      setPrepTime('20 mins');
      setCalories('680');
      setBestseller(true);
      setSpicyLevel(1);
      setIsCombo(false);
      setComboIncludes([]);
      setNewComboItem('');
    }
  }, [itemToEdit, visible]);

  const addComboIncludeItem = () => {
    if (newComboItem.trim()) {
      setComboIncludes([...comboIncludes, newComboItem.trim()]);
      setNewComboItem('');
    }
  };

  const removeComboIncludeItem = (index: number) => {
    setComboIncludes(comboIncludes.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Item Name is required');
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      alert('Valid price is required');
      return;
    }

    const effectiveCategory = customCategory.trim() ? customCategory.trim() : category;

    const payload: MenuItem = {
      id: itemToEdit
        ? itemToEdit.id
        : `item-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      category: effectiveCategory,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: description.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      rating: rating ? parseFloat(rating) : 4.5,
      ratingCount: ratingCount ? parseInt(ratingCount, 10) : 100,
      dietary,
      prepTime: prepTime.trim() || '15 mins',
      calories: calories ? parseInt(calories, 10) : undefined,
      bestseller,
      spicyLevel,
      isCombo,
      comboIncludes: isCombo && comboIncludes.length > 0 ? comboIncludes : undefined,
    };

    if (itemToEdit) {
      updateMenuItem(restaurantId, itemToEdit.id, payload);
    } else {
      addMenuItem(restaurantId, payload);
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
                {itemToEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
              </Text>
              <Text style={styles.modalSubtitle}>
                Add dish details, pricing, combos, dietary tag, and photo
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form Scroll Area */}
          <ScrollView style={styles.formScroll} contentContainerStyle={styles.formContent}>
            {/* Section 1: Basic Dish Details */}
            <Text style={styles.sectionHeader}>1. Dish Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dish / Item Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Shahi Paneer Tikka Platter"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Menu Category</Text>
              <View style={styles.categoryChipsRow}>
                {DEFAULT_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && !customCategory && styles.categoryChipActive,
                    ]}
                    onPress={() => {
                      setCategory(cat);
                      setCustomCategory('');
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === cat && !customCategory && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[styles.input, { marginTop: 6 }]}
                value={customCategory}
                onChangeText={setCustomCategory}
                placeholder="Or type custom category name..."
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Succulent cottage cheese marinated in aromatic herbs and spices..."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Section 2: Pricing */}
            <Text style={styles.sectionHeader}>2. Pricing & Calories</Text>
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Selling Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholder="240"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Original Price (₹) (Optional strikethrough)</Text>
                <TextInput
                  style={styles.input}
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  keyboardType="numeric"
                  placeholder="280"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Preparation Time</Text>
                <TextInput
                  style={styles.input}
                  value={prepTime}
                  onChangeText={setPrepTime}
                  placeholder="15 mins"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Calories (kcal)</Text>
                <TextInput
                  style={styles.input}
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                  placeholder="420"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </View>

            {/* Section 3: Dietary & Badges */}
            <Text style={styles.sectionHeader}>3. Dietary & Tags</Text>
            <View style={styles.rowTwoCols}>
              {/* Veg / Non-Veg */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Dietary Classification</Text>
                <View style={styles.dietarySelectorRow}>
                  <TouchableOpacity
                    style={[
                      styles.dietarySelectBtn,
                      dietary === 'veg' && styles.vegActiveBtn,
                    ]}
                    onPress={() => setDietary('veg')}
                  >
                    <View style={[styles.vegBox, { borderColor: theme.colors.veg }]}>
                      <View style={[styles.vegDot, { backgroundColor: theme.colors.veg }]} />
                    </View>
                    <Text
                      style={[
                        styles.dietarySelectText,
                        dietary === 'veg' && { color: theme.colors.veg, fontWeight: '700' },
                      ]}
                    >
                      VEG
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dietarySelectBtn,
                      dietary === 'non-veg' && styles.nonVegActiveBtn,
                    ]}
                    onPress={() => setDietary('non-veg')}
                  >
                    <View style={[styles.vegBox, { borderColor: theme.colors.nonVeg }]}>
                      <View style={[styles.vegDot, { backgroundColor: theme.colors.nonVeg }]} />
                    </View>
                    <Text
                      style={[
                        styles.dietarySelectText,
                        dietary === 'non-veg' && { color: theme.colors.nonVeg, fontWeight: '700' },
                      ]}
                    >
                      NON-VEG
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bestseller */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Bestseller Badge</Text>
                <View style={styles.switchBox}>
                  <Text style={styles.switchTitle}>Mark as Bestseller</Text>
                  <Switch
                    value={bestseller}
                    onValueChange={setBestseller}
                    trackColor={{ false: '#374151', true: '#F59E0B' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>

            {/* Spicy Level Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Spiciness Level: {spicyLevel === 0 ? 'Mild (No Spice)' : '🌶️'.repeat(spicyLevel)}</Text>
              <View style={styles.spicyLevelRow}>
                {[0, 1, 2, 3].map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[
                      styles.spicyLevelBtn,
                      spicyLevel === lvl && styles.spicyLevelBtnActive,
                    ]}
                    onPress={() => setSpicyLevel(lvl)}
                  >
                    <Text style={styles.spicyLevelBtnText}>
                      {lvl === 0 ? 'Mild (0)' : `${lvl} 🌶️`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Section 4: Combos */}
            <Text style={styles.sectionHeader}>4. Combo Pack Configuration</Text>
            <View style={styles.switchBox}>
              <View>
                <Text style={styles.switchTitle}>Is this a Combo Meal?</Text>
                <Text style={styles.switchSub}>Enables multi-dish breakdown tag list</Text>
              </View>
              <Switch
                value={isCombo}
                onValueChange={setIsCombo}
                trackColor={{ false: '#374151', true: theme.colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            {isCombo && (
              <View style={styles.comboBuilderBox}>
                <Text style={styles.comboBuilderTitle}>Combo Items Included:</Text>
                <View style={styles.comboList}>
                  {comboIncludes.map((cItem, i) => (
                    <View key={i} style={styles.comboItemTag}>
                      <Text style={styles.comboItemTagText}>{cItem}</Text>
                      <TouchableOpacity onPress={() => removeComboIncludeItem(i)}>
                        <Ionicons name="close-circle" size={16} color={theme.colors.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {comboIncludes.length === 0 && (
                    <Text style={styles.emptyComboText}>No included items added yet.</Text>
                  )}
                </View>

                <View style={styles.addComboInputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={newComboItem}
                    onChangeText={setNewComboItem}
                    placeholder="e.g. 2 Butter Naan or Sweet Lassi..."
                    placeholderTextColor={theme.colors.textMuted}
                    onSubmitEditing={addComboIncludeItem}
                  />
                  <TouchableOpacity style={styles.addComboBtn} onPress={addComboIncludeItem}>
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Section 5: Dish Photo */}
            <Text style={styles.sectionHeader}>5. Dish Photo</Text>
            <ImageUploader
              label="Upload Dish Image"
              hint="Upload high-res photo from device or use camera / presets"
              value={image}
              onChangeImage={setImage}
              aspectRatio={[4, 3]}
              presets={FOOD_IMAGE_PRESETS}
              previewHeight={180}
            />
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>
                {itemToEdit ? 'Save Changes' : 'Add to Menu'}
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
    maxWidth: 640,
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
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  dietarySelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dietarySelectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vegActiveBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: theme.colors.veg,
  },
  nonVegActiveBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: theme.colors.nonVeg,
  },
  vegBox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dietarySelectText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  switchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  switchTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  spicyLevelRow: {
    flexDirection: 'row',
    gap: 8,
  },
  spicyLevelBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  spicyLevelBtnActive: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  spicyLevelBtnText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  comboBuilderBox: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  comboBuilderTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  comboList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    minHeight: 32,
    alignItems: 'center',
  },
  comboItemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.xs,
  },
  comboItemTagText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  emptyComboText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  addComboInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addComboBtn: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodPresetsRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  foodPresetChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    marginRight: 6,
  },
  foodPresetText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  imagePreviewBox: {
    marginTop: 6,
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  imagePreviewLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  imagePreviewFrame: {
    height: 140,
    width: '100%',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  previewImg: {
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
