export type RootStackParamList = {
  // Auth
  Login: undefined;
  SignUp: undefined;

  // Main Tab
  Main: undefined;

  // Shop
  ProductDetails: { productId: string };
  CategoryProducts: { categoryId: string; categoryName: string };

  // Cart & Checkout
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };

  // Orders
  OrderHistory: undefined;
  OrderDetails: { orderId: string };

  // Profile
  Profile: undefined;
  Notifications: undefined;

  // Legacy/Utility (Keep if needed for now, or remove if sure)
  WebView: { route: string; title: string };
};

export type TabParamList = {
  Home: undefined;
  Collections: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
  replace: (screen: keyof RootStackParamList, params?: any) => void;
  reset: (options: any) => void;
};
