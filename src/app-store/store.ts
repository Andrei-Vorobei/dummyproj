import { configureStore } from '@reduxjs/toolkit';

import { cartApi } from './api/cart-api';
import { productsApi } from './api/products-api';
import { rootReducer } from './root-reducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([productsApi.middleware, cartApi.middleware]),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
