import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';

const { width } = Dimensions.get('window');

interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Gold Bangles',
    icon: '✨',
    count: 120,
    description: 'Traditional gold bangles for every occasion',
  },
  {
    id: 2,
    name: 'Diamond Bangles',
    icon: '💎',
    count: 85,
    description: 'Elegant diamond-studded bangles',
  },
  {
    id: 3,
    name: 'Glass Bangles',
    icon: '🔮',
    count: 95,
    description: 'Colorful and vibrant glass bangles',
  },
  {
    id: 4,
    name: 'Metal Bangles',
    icon: '⚡',
    count: 67,
    description: 'Modern metal and alloy bangles',
  },
  {
    id: 5,
    name: 'Kundan Bangles',
    icon: '🌟',
    count: 45,
    description: 'Exquisite kundan work bangles',
  },
  {
    id: 6,
    name: 'Meenakari Bangles',
    icon: '🎨',
    count: 52,
    description: 'Handcrafted meenakari bangles',
  },
];

export const CollectionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // Navigate to category products screen
    navigation.navigate('ProductDetails', { productId: categoryId });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Collections" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Shop by Category</Text>
          <Text style={styles.subtitle}>
            Explore our exquisite collection of bangles
          </Text>
        </View>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.categoryCardSelected,
              ]}
              onPress={() => handleCategoryPress(category.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{category.count} items</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
  },
  categoriesGrid: {
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 40) / 2,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  countBadge: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  countText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: colors.neutral.white,
  },
  bottomSpacing: {
    height: 20,
  },
});
