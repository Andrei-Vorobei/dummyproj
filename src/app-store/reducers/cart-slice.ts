import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { cartApi, type CartResponse } from '@/app-store/api/cart-api';

import type { Product } from '../api/products-api';

const initialState: CartResponse = {
  id: 0,
  products: [],
  total: 0,
  discountedTotal: 0,
  userId: 0,
  totalProducts: 0,
  totalQuantity: 0,
};

const recalcculatingCartTotals = (state: CartResponse): void => {
  state.total = state.products.reduce((acc, p) => acc + p.total, 0);
  state.discountedTotal = state.products.reduce((acc, p) => acc + p.discountedTotal, 0);
  state.totalProducts = state.products.length;
  state.totalQuantity = state.products.reduce((acc, p) => acc + p.quantity, 0);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  selectors: {
    getCart: (state: CartResponse) => state,
    getCount: (state) => state.products.length,
  },
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingProduct = state.products.find((p) => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.total = existingProduct.price * existingProduct.quantity;
        existingProduct.discountedTotal =
          existingProduct.total - (existingProduct.total * existingProduct.discountPercentage) / 100;
        recalcculatingCartTotals(state);
      } else {
        const newProduct = {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          total: product.price,
          discountedTotal: product.price - (product.price * product.discountPercentage) / 100,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail,
        };
        state.products.push(newProduct);
        recalcculatingCartTotals(state);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const existingProductIndex = state.products.findIndex((p) => p.id === productId);
      if (existingProductIndex !== -1) {
        state.products.splice(existingProductIndex, 1);
        recalcculatingCartTotals(state);
      }
    },
    clearCart: (state) => {
      state.products = [];
      state.total = 0;
      state.discountedTotal = 0;
      state.totalProducts = 0;
      state.totalQuantity = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(cartApi.endpoints.getCart.matchFulfilled, (_state, action: PayloadAction<CartResponse>) => {
      return action.payload;
    });
  },
});

export const { getCart, getCount } = cartSlice.selectors;
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
