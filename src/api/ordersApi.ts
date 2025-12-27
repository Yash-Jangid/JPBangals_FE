import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import { CartItem } from './cartApi';

export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  items: CartItem[];
  shipping_address: Address;
  payment_method: string;
  created_at: string;
}

export interface Address {
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQuery,
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
    }),
    createOrder: builder.mutation<Order, { address_id: number; payment_method: string }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery, useCreateOrderMutation } = ordersApi;
