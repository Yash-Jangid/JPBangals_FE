import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import { Product } from './productsApi';

export interface CartItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  size: string;
  price: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_amount: number;
  total_items: number;
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQuery,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<Cart, { product_id: number; quantity: number; size: string }>({
      query: (body) => ({
        url: '/cart/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<Cart, { item_id: number; quantity: number }>({
      query: ({ item_id, quantity }) => ({
        url: `/cart/items/${item_id}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<Cart, number>({
      query: (item_id) => ({
        url: `/cart/items/${item_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const { 
  useGetCartQuery, 
  useAddToCartMutation, 
  useUpdateCartItemMutation, 
  useRemoveFromCartMutation 
} = cartApi;
