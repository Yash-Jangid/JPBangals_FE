import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  images: string[];
  category_id: number;
  sizes: string[];
  rating?: number;
  reviews_count?: number;
  is_featured?: boolean;
  is_new?: boolean;
}

export interface Category {
  id: number;
  name: string;
  image?: string;
  slug: string;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { category_id?: number; featured?: boolean; search?: string } | void>({
      query: (params) => ({
        url: '/products',
        params: params || undefined,
      }),
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery, useGetCategoriesQuery } = productsApi;
