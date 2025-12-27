import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
  category: string;
}

// Dummy cart data
const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: 'Royal Kundan Gold Bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop',
    price: 15999,
    size: '2.4',
    quantity: 2,
    category: 'Gold',
  },
  {
    id: 2,
    name: 'Diamond Studded Pearl Bangles',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop',
    price: 28999,
    size: '2.6',
    quantity: 1,
    category: 'Diamond',
  },
  {
    id: 3,
    name: 'Meenakari Colorful Bangles Set',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=200&fit=crop',
    price: 3499,
    size: '2.4',
    quantity: 4,
    category: 'Meenakari',
  },
  {
    id: 4,
    name: 'Glass Bangles Rainbow Set',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=200&fit=crop',
    price: 1299,
    size: '2.2',
    quantity: 2,
    category: 'Glass',
  },
];

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemSize}>Size: {item.size}"</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, -1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add some beautiful bangles to get started
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopNowButtonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Shopping Cart" />
        {renderEmptyCart()}
      </View>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <View style={styles.container}>
      <CustomHeader title="Shopping Cart" />

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text>
              <Text style={styles.summaryValue}>₹{subtotal}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValueFree}>FREE</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>
          </View>
        }
      />

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout (₹{total})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemCategory: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: colors.primary.main,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: colors.primary.main,
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
  },
  quantityValue: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: colors.semantic.error,
  },
  summarySection: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 100,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.text.primary,
  },
  summaryValueFree: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: colors.semantic.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: colors.primary.main,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: Fonts.semiBold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopNowButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
  },
  shopNowButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.neutral.white,
  },
});
