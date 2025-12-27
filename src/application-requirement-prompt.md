# React Native E-Commerce Mobile App - Complete Development Prompt

## 🎯 Project Overview
Build a production-ready **Bangles E-Commerce Mobile Application** for Android and iOS using React Native with TypeScript. The application must be highly scalable, maintainable, and follow industry best practices.

NOTE: i want you to redesign this application codebase. im decide to reuse a react native application as an base and will modify the screens according to the new requirement. so this approach will save my tuime login signup, navigation other component is already implement . i want a comprehensive prompt a agent who can create the new screen according to my new requirments using existing functionality and components.
---

## 📋 Core Requirements

### Application Type
- **Platform**: React Native (Android & iOS)
- **Language**: TypeScript (strict mode)
- **State Management**: Redux Toolkit with RTK Query
- **Navigation**: React Navigation v6+
- **UI Framework**: React Native Paper / Native Base (choose one consistently)

### Business Features
1. **Home Page**: Hero banners, collections, categories, featured products
2. **Product Details**: Image carousel, pricing, offers, specifications, reviews, suggestions
3. **Shopping Cart**: Item management, quantity control, price calculations
4. **Checkout**: Address form, coupon codes, payment methods (COD, PhonePe)
5. **Orders**: Order history, tracking, order details

---

## 🎨 Design System & Styling

### Global Color Configuration
Create a centralized theme configuration file with the following structure:

```typescript
// src/theme/colors.ts
export const colors = {
  primary: {
    main: '#D4AF37',      // Gold - for bangles theme
    light: '#F4E4C1',
    dark: '#A08528',
    contrast: '#FFFFFF'
  },
  secondary: {
    main: '#8B4513',      // Saddle Brown - traditional feel
    light: '#CD853F',
    dark: '#654321',
    contrast: '#FFFFFF'
  },
  accent: {
    main: '#FF6B6B',      // Coral - for offers/discounts
    light: '#FFE0E0',
    dark: '#E05555'
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827'
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6'
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    disabled: '#D1D5DB',
    inverse: '#FFFFFF'
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF'
  }
};

// Typography configuration
export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold'
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
};

// Spacing system (4px base)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8
  }
};
```

### Responsive Design Strategy
```typescript
// src/utils/responsive.ts
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12 Pro)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const deviceWidth = SCREEN_WIDTH;
export const deviceHeight = SCREEN_HEIGHT;

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;
```

---

## 🏗️ Project Architecture

### Folder Structure
```
src/
├── api/
│   ├── endpoints/
│   │   ├── auth.api.ts
│   │   ├── products.api.ts
│   │   ├── cart.api.ts
│   │   ├── orders.api.ts
│   │   └── reviews.api.ts
│   └── baseQuery.ts
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/
│   ├── atoms/                    # Smallest reusable components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   └── Button.types.ts
│   │   ├── Text/
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Icon/
│   │   └── Spinner/
│   ├── molecules/                # Combination of atoms
│   │   ├── ProductCard/
│   │   ├── CartItem/
│   │   ├── ReviewCard/
│   │   ├── AddressCard/
│   │   ├── OrderCard/
│   │   ├── SearchBar/
│   │   ├── PriceDisplay/
│   │   └── QuantitySelector/
│   ├── organisms/                # Complex components
│   │   ├── ProductCarousel/
│   │   ├── CategoryList/
│   │   ├── CollectionGrid/
│   │   ├── ReviewSection/
│   │   ├── CheckoutForm/
│   │   └── OrderSummary/
│   └── templates/                # Page layouts
│       ├── MainLayout/
│       ├── AuthLayout/
│       └── CheckoutLayout/
├── hooks/
│   ├── useDebounce.ts
│   ├── useThrottle.ts
│   ├── useKeyboard.ts
│   ├── useOrientation.ts
│   └── useCart.ts
├── navigation/
│   ├── RootNavigator.tsx
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   ├── TabNavigator.tsx
│   └── navigationTypes.ts
├── screens/
│   ├── Home/
│   │   ├── HomeScreen.tsx
│   │   └── HomeScreen.styles.ts
│   ├── ProductDetails/
│   ├── Cart/
│   ├── Checkout/
│   ├── Orders/
│   ├── Profile/
│   └── Auth/
├── store/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── cartSlice.ts
│   │   ├── wishlistSlice.ts
│   │   └── uiSlice.ts
│   ├── store.ts
│   └── hooks.ts
├── services/
│   ├── StorageService.ts
│   ├── NotificationService.ts
│   └── AnalyticsService.ts
├── utils/
│   ├── validators.ts
│   ├── formatters.ts
│   ├── helpers.ts
│   └── constants.ts
├── types/
│   ├── product.types.ts
│   ├── order.types.ts
│   ├── user.types.ts
│   └── api.types.ts
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
└── App.tsx
```

---

## 🔧 State Management Architecture

### Redux Toolkit Setup
```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API
import { productsApi } from '@/api/endpoints/products.api';
import { cartApi } from '@/api/endpoints/cart.api';
import { ordersApi } from '@/api/endpoints/orders.api';

// Slices
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart', 'wishlist'], // Only persist these
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authReducer),
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    
    // RTK Query APIs
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(
      productsApi.middleware,
      cartApi.middleware,
      ordersApi.middleware
    ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 🎨 Reusable Component Examples

### 1. Atomic Button Component
```typescript
// src/components/atoms/Button/Button.types.ts
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress: () => void;
  children: React.ReactNode;
  testID?: string;
}

// src/components/atoms/Button/Button.tsx
import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Text } from '../Text/Text';
import { styles } from './Button.styles';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onPress,
  children,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={styles[variant].activityIndicatorColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[styles.text, styles[`${variant}Text`]]}>{children}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};
```

### 2. Product Card Component (Molecule)
```typescript
// src/components/molecules/ProductCard/ProductCard.tsx
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/atoms/Text/Text';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Icon } from '@/components/atoms/Icon/Icon';
import { PriceDisplay } from '@/components/molecules/PriceDisplay/PriceDisplay';
import { styles } from './ProductCard.styles';
import { ProductCardProps } from './ProductCard.types';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  showWishlist = true,
}) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    if (onPress) {
      onPress(product.id);
    } else {
      navigation.navigate('ProductDetails', { productId: product.id });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <Badge
            variant="danger"
            style={styles.discountBadge}
          >
            {product.discountPercentage}% OFF
          </Badge>
        )}
        
        {/* Wishlist Icon */}
        {showWishlist && (
          <TouchableOpacity style={styles.wishlistButton}>
            <Icon name="heart" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.title}>
          {product.name}
        </Text>
        
        <PriceDisplay
          mrp={product.mrp}
          sellingPrice={product.sellingPrice}
          size="sm"
        />
        
        {/* Rating */}
        {product.rating && (
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#F59E0B" />
            <Text variant="caption" style={styles.rating}>
              {product.rating.toFixed(1)} ({product.reviewCount})
            </Text>
          </View>
        )}
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => onAddToCart?.(product.id)}
      >
        <Icon name="shopping-cart" size={18} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
```

### 3. Image Carousel (Organism)
```typescript
// src/components/organisms/ProductCarousel/ProductCarousel.tsx
import React, { useRef, useState } from 'react';
import { View, FlatList, Image, Dimensions } from 'react-native';
import { styles } from './ProductCarousel.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};
```

---

## 🎯 Design Patterns to Implement

### 1. Strategy Pattern for Payment
```typescript
// src/strategies/payment/PaymentStrategy.ts
export interface PaymentStrategy {
  processPayment(amount: number, orderId: string): Promise<PaymentResult>;
  validatePayment(paymentId: string): Promise<boolean>;
}

// COD Strategy
export class CODPaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, orderId: string): Promise<PaymentResult> {
    // COD logic
    return { success: true, paymentId: `COD-${orderId}` };
  }
  
  async validatePayment(paymentId: string): Promise<boolean> {
    return true;
  }
}

// PhonePe Strategy
export class PhonePePaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, orderId: string): Promise<PaymentResult> {
    // PhonePe SDK integration
    const response = await PhonePeSDK.initiatePayment({ amount, orderId });
    return response;
  }
  
  async validatePayment(paymentId: string): Promise<boolean> {
    return await PhonePeSDK.verifyPayment(paymentId);
  }
}

// Payment Context
export class PaymentProcessor {
  private strategy: PaymentStrategy;
  
  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }
  
  async executePayment(amount: number, orderId: string) {
    return await this.strategy.processPayment(amount, orderId);
  }
}
```

### 2. Factory Pattern for API Responses
```typescript
// src/factories/ResponseFactory.ts
export class ResponseFactory {
  static createSuccessResponse<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message: message || 'Operation successful',
      timestamp: new Date().toISOString(),
    };
  }
  
  static createErrorResponse(error: Error, code?: string) {
    return {
      success: false,
      error: {
        message: error.message,
        code: code || 'UNKNOWN_ERROR',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
```

### 3. Observer Pattern for Cart Updates
```typescript
// src/observers/CartObserver.ts
export interface CartObserver {
  update(cart: Cart): void;
}

export class CartSubject {
  private observers: CartObserver[] = [];
  
  attach(observer: CartObserver) {
    this.observers.push(observer);
  }
  
  detach(observer: CartObserver) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  notify(cart: Cart) {
    this.observers.forEach(observer => observer.update(cart));
  }
}
```

### 4. Singleton Pattern for Services
```typescript
// src/services/StorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  private static instance: StorageService;
  
  private constructor() {}
  
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }
  
  async setItem(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
  
  async getItem<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}
```

---

## 📱 Screen Implementation Examples

### Home Screen Structure
```typescript
// src/screens/Home/HomeScreen.tsx
import React from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { HeroBanner } from '@/components/organisms/HeroBanner';
import { CollectionGrid } from '@/components/organisms/CollectionGrid';
import { CategoryList } from '@/components/organisms/CategoryList';
import { ProductGrid } from '@/components/organisms/ProductGrid';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { useGetHomeDataQuery } from '@/api/endpoints/home.api';

export const HomeScreen: React.FC = () => {
  const { data, isLoading, refetch } = useGetHomeDataQuery();
  
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {/* Hero Banners */}
      <HeroBanner banners={data?.banners} />
      
      {/* Collections */}
      <SectionHeader title="Collections" onSeeAll={() => {}} />
      <CollectionGrid collections={data?.collections} />
      
      {/* Categories */}
      <SectionHeader title="Shop by Category" />
      <CategoryList categories={data?.categories} />
      
      {/* Featured Products */}
      <SectionHeader title="Featured Products" />
      <ProductGrid products={data?.featuredProducts} />
    </ScrollView>
  );
};
```

---

## ✅ Quality Checklist for Each Component

When building components, ensure:

1. **TypeScript**
   - [ ] All props are typed with interfaces
   - [ ] Return types are explicit
   - [ ] No `any` types used

2. **Styling**
   - [ ] Uses theme colors from global config
   - [ ] Responsive sizing with scale/moderateScale
   - [ ] Platform-specific adjustments where needed
   - [ ] Shadow styles work on both iOS and Android

3. **Accessibility**
   - [ ] Has accessible={true} where needed
   - [ ] accessibilityLabel for interactive elements
   - [ ] accessibilityRole defined
   - [ ] Minimum touch target size (44x44)

4. **Performance**
   - [ ] useCallback for function props
   - [ ] useMemo for expensive calculations
   - [ ] React.memo for pure components
   - [ ] FlatList for lists (not ScrollView + map)

5. **Testing**
   - [ ] Has testID for key elements
   - [ ] Can be unit tested
   - [ ] Handles loading/error states

6. **Reusability**
   - [ ] Accepts configuration via props
   - [ ] No hardcoded values
   - [ ] Can be styled externally if needed
   - [ ] Follows single responsibility principle

---

## 🚀 Development Guidelines

### Code Style
- Use functional components with hooks
- Prefer TypeScript strict mode
- Use ESLint + Prettier
- Follow Airbnb style guide
- Meaningful variable names (no abbreviations)

### Component Naming
- PascalCase for components
- camelCase for functions/variables
- UPPER_SNAKE_CASE for constants
- Prefix custom hooks with 'use'

### File Organization
- One component per file
- Collocate styles with components
- Separate types into .types.ts files
- Keep test files adjacent (.test.tsx)

### Git Commit Messages
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring
- style: Formatting changes
- docs: Documentation
- test: Adding tests
- chore: Maintenance tasks

---

## 🎯 Required npm Packages

```json
{
  "dependencies": {
    "react-native": "latest",
    "@react-navigation/native": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@react-navigation/native-stack": "^6.x",
    "@reduxjs/toolkit": "^2.x",
    "react-redux": "^9.x",
    "redux-persist": "^6.x",
    "@react-native-async-storage/async-storage": "^1.x",
    "react-native-paper": "^5.x",
    "react-native-vector-icons": "^10.x",
    "axios": "^1.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "react-native-fast-image": "^8.x",
    "react-native-reanimated": "^3.x",
    "react-native-gesture-handler": "^2.x",
    "react-native-svg": "^14.x"
  }
}
```

---

## 🎨 Output Expectations

For each screen/feature requested, provide:

1. **Component Code** (TypeScript)
   - Full implementation
   - Type definitions
   - Props interface

2. **Styles** (StyleSheet)
   - Using theme config
   - Responsive scaling
   - Platform-specific styles

3. **State Management**
   - Redux slice if needed
   - RTK Query endpoint
   - Local state with useState

4. **Navigation**
   - Screen registration
   - Navigation types
   - Params interface

5. **API Integration**
   - Endpoint definition
   - Request/response types
   - Error handling

---

## 📝 Example Request Format

When I ask: "Build the Product Details Screen"

You should provide:
1. Screen component with full logic
2. All required child components
3. Styling with theme colors
4. Redux integration for cart actions
5. API query hooks
6. Navigation types
7. TypeScript interfaces
8. Accessibility features
9. Loading/error states
10. Platform-specific adjustments

---

## 🎯 Success Metrics

The code you generate should be:
- ✅ Copy-paste ready
- ✅ Type-safe (no errors in strict mode)
- ✅ Responsive (works on all device sizes)
- ✅ Themed (uses global color config)
- ✅ Reusable (follows atomic design)
- ✅ Scalable (uses proper patterns)
- ✅ Performant (optimized rendering)
- ✅ Accessible (follows a11y guidelines)
- ✅ Testable (has testIDs and clear logic)
- ✅ Documented (includes JSDoc comments)

---

## 🚨 Critical Requirements

**ALWAYS:**
- Use TypeScript with explicit types
- Import colors from theme config
- Use responsive sizing functions
- Include both iOS and Android handling
- Implement proper error boundaries
- Add loading states for async operations
- Handle empty states gracefully
- Include proper prop validation

**NEVER:**
- Hardcode colors or sizes
- Use inline styles for complex components
- Ignore platform differences
- Skip type definitions
- Use 'any' type
- Create deeply nested components
- Forget accessibility props
- Skip error handling

---

## 🎓 Start Building!

You are now ready to build a production-quality React Native e-commerce application. When I request any screen, component, or feature, follow this prompt strictly and deliver scalable, reusable, and maintainable code.

**Remember: Quality over speed. Reusability over repetition. Scalability over shortcuts.**