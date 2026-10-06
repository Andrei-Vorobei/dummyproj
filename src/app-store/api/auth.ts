import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig } from 'axios';

import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

type AxiosBaseQueryArgs = {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
};

type AxiosBaseQueryRequest = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
};

type AuthApiError = {
  status: number | 'FETCH_ERROR';
  data: unknown;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};

export const axiosBaseQuery =
  ({ baseUrl, defaultHeaders }: AxiosBaseQueryArgs): BaseQueryFn<AxiosBaseQueryRequest, unknown, AuthApiError> =>
  async ({ url, method = 'GET', data, params, headers }, { signal }) => {
    try {
      const response = await axios({
        url: `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`,
        method,
        data,
        params,
        signal,
        headers: {
          Accept: 'application/json',
          ...defaultHeaders,
          ...headers,
        },
      });

      return { data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: {
            status: error.response?.status ?? 'FETCH_ERROR',
            data: error.response?.data ?? error.message,
          },
        };
      }

      return {
        error: {
          status: 'FETCH_ERROR',
          data: error instanceof Error ? error.message : 'An unknown request error occurred',
        },
      };
    }
  };

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_AUTH_API_URL ?? 'https://localhost:3000',
    defaultHeaders: { 'Content-Type': 'application/json' },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthSession, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        data: credentials,
      }),
    }),
    register: builder.mutation<AuthUser, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        data: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
