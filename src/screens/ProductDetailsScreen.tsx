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

// Bangle sizes in inches
const BANGLE_SIZES = ['2.2', '2.4', '2.6', '2.8'];

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  images: string[];
  rating: number;
  reviews_count: number;
  category: string;
}

// Dummy products data
const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Royal Kundan Gold Bangles',
    description: 'Exquisite kundan work on 22K gold bangles. Features traditional Rajasthani craftsmanship with intricate stone settings. Perfect for weddings and festive occasions. Comes in a beautiful velvet box.',
    price: 18999,
    discount_price: 15999,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
    ],
    rating: 4.8,
    reviews_count: 342,
    category: 'Gold',
  },
  {
    id: 2,
    name: 'Diamond Studded Pearl Bangles',
    description: 'Elegant diamond-studded bangles with premium South Sea pearls. 18K white gold setting with VS clarity diamonds. Ideal for grand occasions and celebrations.',
    price: 32999,
    discount_price: 28999,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=800&fit=crop',
    ],
    rating: 4.9,
    reviews_count: 567,
    category: 'Diamond',
  },
  {
    id: 3,
    name: 'Meenakari Colorful Bangles Set',
    description: 'Traditional Jaipur meenakari work with vibrant colors on brass base. Hand-painted by skilled artisans. Set of 6 bangles with matching colors. Lightweight and comfortable for daily wear.',
    price: 4999,
    discount_price: 3499,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
    ],
    rating: 4.6,
    reviews_count: 789,
    category: 'Meenakari',
  },
  {
    id: 4,
    name: 'Antique Temple Design Bangles',
    description: 'Beautiful temple-inspired designs with deity motifs. Made with oxidized silver finish. Features traditional South Indian temple architecture patterns. Set includes 4 bangles.',
    price: 14999,
    discount_price: 12499,
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
    ],
    rating: 4.7,
    reviews_count: 423,
    category: 'Gold',
  },
  {
    id: 5,
    name: 'Glass Bangles Rainbow Set',
    description: 'Colorful glass bangles in vibrant rainbow shades. Traditional lac work with mirror embellishments. Set of 12 bangles perfect for festivals. Hyderabad special collection.',
    price: 1999,
    discount_price: 1299,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
    ],
    rating: 4.4,
    reviews_count: 1205,
    category: 'Glass',
  },
  {
    id: 6,
    name: 'Modern Geometric Metal Bangles',
    description: 'Contemporary design metal bangles with geometric patterns. Made from high-quality stainless steel with gold plating. Tarnish-resistant and perfect for daily office wear. Set of 3.',
    price: 3999,
    discount_price: 2999,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
    ],
    rating: 4.5,
    reviews_count: 634,
    category: 'Metal',
  },
];

export const ProductDetailsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route
}) => {
  // Get product from route params or use first product as default
  const productId = route?.params?.productId || 1;
  const product = DUMMY_PRODUCTS.find(p => p.id === productId) || DUMMY_PRODUCTS[0];

  const [selectedSize, setSelectedSize] = useState<string>('2.4');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Adding to cart:', {
      product: product,
      size: selectedSize,
      quantity
    });
  };

  const handleBuyNow = () => {
    // Navigate to checkout
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Product Details" showBackButton onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.imagePaginationContainer}>
            {product.images.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  selectedImageIndex === index && styles.paginationDotActive,
                ]}
                onPress={() => setSelectedImageIndex(index)}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>{product.category} Bangles</Text>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {product.rating}</Text>
            <Text style={styles.reviewsText}>({product.reviews_count} reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            {product.discount_price && (
              <>
                <Text style={styles.discountPrice}>₹{product.discount_price}</Text>
                <Text style={styles.originalPrice}>₹{product.price}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                  </Text>
                </View>
              </>
            )}
            {!product.discount_price && (
              <Text style={styles.discountPrice}>₹{product.price}</Text>
            )}
          </View>

          {/* Size Selection */}
          <View style={styles.sizeSection}>
            <Text style={styles.sectionTitle}>Select Size (inches)</Text>
            <View style={styles.sizesContainer}>
              {BANGLE_SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.sizeTextSelected,
                    ]}
                  >
                    {size}"
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
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
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: colors.neutral.gray100,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imagePaginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray400,
  },
  paginationDotActive: {
    backgroundColor: colors.primary.main,
    width: 24,
  },
  productInfo: {
    padding: 20,
  },
  productCategory: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.primary.main,
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  discountPrice: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: colors.primary.main,
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: colors.accent.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: colors.neutral.white,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  sizesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border.medium,
    backgroundColor: colors.neutral.white,
  },
  sizeButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  sizeText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
  },
  sizeTextSelected: {
    color: colors.primary.main,
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
  },
  quantityValue: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.neutral.white,
    borderWidth: 2,
    borderColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.primary.main,
  },
  buyNowButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },
});
