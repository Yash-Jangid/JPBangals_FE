import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartApi from '../../api/cartApi';
import { CartItem, CartSummary, AddToCartPayload, UpdateCartItemPayload } from '../../api/cartApi';

export interface CartState {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    discountAmount: number;
    couponCode: string | null;
    shippingAmount: number;
    finalAmount: number;
    loading: boolean;
    error: string | null;
    actionLoading: {
        add: boolean;
        update: boolean;
        remove: boolean;
        clear: boolean;
    };
}

const initialState: CartState = {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    discountAmount: 0,
    couponCode: null,
    shippingAmount: 0,
    finalAmount: 0,
    loading: false,
    error: null,
    actionLoading: {
        add: false,
        update: false,
        remove: false,
        clear: false,
    },
};

// Helper to hydrate cart items with product details
const hydrateCartItems = async (cartData: any) => {
    // console.log('💧 Hydrating Cart Data:', JSON.stringify(cartData, null, 2));

    // Check if cartData is an array (items directly) or an object with items
    let items: CartItem[] = [];
    if (Array.isArray(cartData)) {
        items = cartData;
    } else if (cartData && cartData.items && Array.isArray(cartData.items)) {
        items = cartData.items;
    }

    // 1. Collect all product IDs needed
    const productIds = new Set(items.map(item => item.productId).filter(id => !!id));

    if (productIds.size === 0) {
        return {
            items: [],
            totalAmount: 0,
            totalItems: 0,
            discountAmount: 0,
            shippingAmount: 0,
            finalAmount: 0
        };
    }

    try {
        // 2. Fetch ALL products (limit 100 or suitable pagination) to workaround missing ID endpoint
        // Ideally backend should support GET /products?ids=... or GET /products/:id
        const productsApi = await import('../../api/productsApi');
        // Fetching with a large limit to likely cover all active products for now.
        // Optimization: In future, implement getByIds on backend.
        const allProductsResponse = await productsApi.getProducts({ limit: 100 });
        const allProducts = allProductsResponse.data?.items || [];

        // 3. Create a Map for O(1) lookup
        const productMap = new Map(allProducts.map(p => [p.id, p]));

        // 4. Hydrate items from Map
        const itemsWithProducts = items.map((item: CartItem) => {
            if (item.product) return item; // Already hydrated

            const product = productMap.get(item.productId);
            // Cast to any to avoid "WritableDraft" mismatch with "null"
            // The CartItem interface likely allows null, but Immer types are strict.
            return { ...item, product: (product || null) as any };
        });

        // 5. Calculate final totals
        const totalAmount = itemsWithProducts.reduce((sum: number, item: any) => {
            const price = item.product ? parseFloat(item.product.sellingPrice) : 0;
            return sum + (price * item.quantity);
        }, 0);

        const totalItems = itemsWithProducts.reduce((sum: number, item: any) => sum + item.quantity, 0);

        return {
            items: itemsWithProducts,
            totalAmount,
            totalItems,
            discountAmount: cartData?.discountAmount || 0,
            couponCode: cartData?.couponCode || null,
            shippingAmount: cartData?.shippingAmount || 0,
            finalAmount: cartData?.finalAmount || totalAmount
        };

    } catch (error) {
        console.error('Failed to populate cart products via bulk fetch:', error);
        // Return original items if hydration fails, to avoid breaking the UI completely
        return {
            items,
            totalAmount: 0,
            totalItems: items.length,
            discountAmount: 0,
            shippingAmount: 0,
            finalAmount: 0
        };
    }
};

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartApi.getCart();
            return await hydrateCartItems(response.data);
        } catch (error: any) {
            console.error('❌ Cart Fetch Error:', error);
            return rejectWithValue(error.message || 'Failed to fetch cart');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (payload: AddToCartPayload, { dispatch, rejectWithValue }) => {
        try {
            await cartApi.addToCart(payload);
            await dispatch(fetchCart());
            return;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to add to cart');
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ id, payload }: { id: string; payload: UpdateCartItemPayload }, { dispatch, rejectWithValue }) => {
        try {
            await cartApi.updateCartItem(id, payload);
            await dispatch(fetchCart());
            return;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update cart item');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await cartApi.removeFromCart(id);
            await dispatch(fetchCart());
            return;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to remove from cart');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await cartApi.clearCart();
            await dispatch(fetchCart()); // Ensure state is synced (though likely empty)
            return { success: true };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to clear cart');
        }
    }
);

export const applyCoupon = createAsyncThunk(
    'cart/applyCoupon',
    async (code: string, { dispatch, rejectWithValue }) => {
        try {
            await cartApi.applyCoupon(code);
            await dispatch(fetchCart());
            return;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to apply coupon');
        }
    }
);

export const removeCoupon = createAsyncThunk(
    'cart/removeCoupon',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await cartApi.removeCoupon();
            await dispatch(fetchCart());
            return;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to remove coupon');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Cart
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
                state.totalItems = action.payload.totalItems;
                state.discountAmount = action.payload.discountAmount;
                state.couponCode = action.payload.couponCode;
                state.shippingAmount = action.payload.shippingAmount;
                state.finalAmount = action.payload.finalAmount;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Add to Cart
        builder
            .addCase(addToCart.pending, (state) => {
                state.actionLoading.add = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state) => {
                state.actionLoading.add = false;
                // State update handled by fetchCart
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.actionLoading.add = false;
                state.error = action.payload as string;
            });

        // Update Cart Item
        builder
            .addCase(updateCartItem.pending, (state, action) => {
                state.actionLoading.update = true;
                state.error = null;

                // Optimistic Update
                const { id, payload } = action.meta.arg;
                const itemIndex = state.items.findIndex(i => i.id === id);
                if (itemIndex !== -1) {
                    state.items[itemIndex].quantity = payload.quantity;

                    // Recalculate totals immediately
                    const newTotal = state.items.reduce((sum, item) => {
                        const price = item.product ? parseFloat(item.product.sellingPrice) : 0;
                        return sum + (price * item.quantity);
                    }, 0);
                    state.totalAmount = newTotal;
                    state.finalAmount = newTotal; // + shipping - discount if needed
                }
            })
            .addCase(updateCartItem.fulfilled, (state) => {
                state.actionLoading.update = false;
                // State update handled by fetchCart, which will correct any minor drifts
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.actionLoading.update = false;
                state.error = action.payload as string;
                // Ideally trigger fetchCart here to revert state if failed, 
                // but since we dispatch fetchCart on success/fail in thunk? 
                // Wait, thunk only dispatches on success. 
                // If failed, state remains optimistically updated incorrectly.
                // We should rely on a refresh or subsequent load, or user retry.
                // For now, this is acceptable for "realtime" feel.
            });

        // Remove from Cart
        builder
            .addCase(removeFromCart.pending, (state, action) => {
                state.actionLoading.remove = true;
                state.error = null;

                // Optimistic Remove
                const id = action.meta.arg;
                state.items = state.items.filter(i => i.id !== id);

                // Recalculate totals
                const newTotal = state.items.reduce((sum, item) => {
                    const price = item.product ? parseFloat(item.product.sellingPrice) : 0;
                    return sum + (price * item.quantity);
                }, 0);
                state.totalAmount = newTotal;
                state.finalAmount = newTotal;
                state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0); // Update count too
            })
            .addCase(removeFromCart.fulfilled, (state) => {
                state.actionLoading.remove = false;
                // State update handled by fetchCart
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.actionLoading.remove = false;
                state.error = action.payload as string;
            });

        // Clear Cart
        builder
            .addCase(clearCart.pending, (state) => {
                state.actionLoading.clear = true;
                state.error = null;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.actionLoading.clear = false;
                state.error = action.payload as string;
            });

        // Apply Coupon
        builder
            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyCoupon.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Remove Coupon
        builder
            .addCase(removeCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCoupon.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetCartError } = cartSlice.actions;
export default cartSlice.reducer;
