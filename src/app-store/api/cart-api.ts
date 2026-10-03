import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosError, AxiosRequestConfig } from 'axios';

import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

type AxiosBaseQueryArgs = {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
};

export const axiosBaseQuery =
  ({
    baseUrl,
    defaultHeaders,
  }: AxiosBaseQueryArgs): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = 'GET', data, params, headers }) => {
    try {
      const result = await axios({
        url: `${baseUrl}${url}`,
        method,
        data,
        params,
        headers: { ...defaultHeaders, ...headers },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };

export type CartProduct = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
};

export type CartResponse = {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => ({ url: `/carts/1` }),
    }),
  }),
});

export const { useGetCartQuery } = cartApi;
