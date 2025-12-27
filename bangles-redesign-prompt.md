# Bangles E-Commerce App Redesign Prompt

## 🎯 Objective
Transform the existing "Edurise" React Native application into a production-ready **Bangles E-Commerce Application**. 
You must **reuse** the existing foundation (Authentication, Navigation setup, Redux, API services) while implementing new E-Commerce specific screens and logic.

## 📂 Existing Codebase Context
The current project is a React Native app (TypeScript) with the following structure:
- **Auth**: `LoginScreen`, `SignUpScreen`, `authSlice` (Redux), `ApiService` (Auth endpoints). **KEEP THESE**.
- **Navigation**: `AppNavigator` using React Navigation v7 (Stack + Tab). **REFACTOR THIS**.
- **State**: Redux Toolkit (`store/index.ts`, `store/slices/`). **EXTEND THIS**.
- **UI**: Basic components in `src/components/ui`. **REUSE & EXTEND**.
- **Dependencies**: `@reduxjs/toolkit`, `react-native-vector-icons`, `react-native-reanimated`, `axios`.

## 📋 New Requirements
Implement the following features on top of the existing base:

### 1. Design System (New)
- Install `react-native-paper` for UI components.
- Create `src/theme/colors.ts` with the Gold/Brown theme specified below:
  - Primary: `#D4AF37` (Gold)
  - Secondary: `#8B4513` (Saddle Brown)
  - Background: `#FFFFFF`

### 2. State Management (Upgrade)
- The current app uses `axios` in `ApiService.ts`.
- **Requirement**: Implement **RTK Query** for the new E-Commerce features (Products, Cart, Orders).
- Create `src/api/productsApi.ts`, `src/api/cartApi.ts`, `src/api/ordersApi.ts`.
- Integrate these into the existing Redux store (`src/store/index.ts`).

### 3. Navigation Structure (Refactor)
Modify `src/navigation/AppNavigator.tsx`:
- **Keep**: `Login`, `SignUp`.
- **Remove**: `Meetings`, `Courses`, `LiveSession`, `Certificates` screens.
- **Create/Add**:
  - **Tab Navigator**:
    - `Home` (Bangles Showcase)
    - `Collections` (Categories)
    - `Cart` (Shopping Bag)
    - `Profile` (User Account - reuse `OptimizedProfileScreen` but rename/clean up)
  - **Stack Screens**:
    - `ProductDetails`
    - `Checkout`
    - `OrderHistory`
    - `OrderDetails`

### 4. Screen Implementation
Implement the following screens using `react-native-paper` and the new Theme:

#### A. Home Screen (`src/screens/HomeScreen.tsx`)
- Replace existing `CustomHomeScreen`.
- Features:
  - Hero Banner (Carousel of latest bangle collections).
  - "Shop by Category" (Gold, Diamond, Glass, Metal).
  - "Featured Products" horizontal list.
  - Search Bar (Header).

#### B. Product Details (`src/screens/ProductDetailsScreen.tsx`)
- Image Carousel.
- Price, Size Selection (Bangle sizes: 2.2, 2.4, 2.6, 2.8).
- "Add to Cart" and "Buy Now" buttons.
- Related Products.

#### C. Cart & Checkout
- `CartScreen`: List items, update quantities, show total.
- `CheckoutScreen`: Address input, Payment method selection (COD, PhonePe), Order Summary.

#### D. Orders
- `OrdersScreen`: List of past orders with status.

## 🛠️ Step-by-Step Implementation Plan for the Agent

1.  **Setup & Dependencies**:
    - Install `react-native-paper`.
    - Create `src/theme/colors.ts` and configure the theme.

2.  **State Management**:
    - Create `src/api/baseQuery.ts` (using `fetchBaseQuery`).
    - Create `productsApi` slice (endpoints: `getProducts`, `getProductById`, `getCategories`).
    - Create `cartApi` slice.
    - Update `store.ts` to include these new reducers and middleware.

3.  **Navigation Refactoring**:
    - Clean up `AppNavigator.tsx`.
    - Remove unused screens from the navigator.
    - Define new routes in `src/types/navigation.ts`.

4.  **Screen Development**:
    - **Home**: Build the main storefront.
    - **Product Details**: Create the detailed view.
    - **Cart**: Implement cart logic using RTK Query or local state if API not ready.
    - **Profile**: Adapt the existing `OptimizedProfileScreen` to remove "Course" related info and show "Orders" instead.

5.  **Cleanup**:
    - Delete unused screens (e.g., `Meeting*`, `Course*`, `Quiz*`) to keep the codebase clean.

## 💡 Key Instructions
- **Do NOT** rewrite the Authentication logic. It works.
- **Do NOT** change the folder structure drastically.
- **Use** `react-native-paper` for consistent UI.
- **Use** `RTK Query` for data fetching.
