import { combineSlices } from '@reduxjs/toolkit';

import { cartApi } from './api/cart-api';
import { productsApi } from './api/products-api';
import { appGlobalSlice } from './reducers/app-global';
import { cartSlice } from './reducers/cart-slice';

export const rootReducer = combineSlices(appGlobalSlice, cartSlice, productsApi, cartApi);
