import { combineSlices } from '@reduxjs/toolkit';

import { authApi } from './api/auth';
import { cartApi } from './api/cart-api';
import { productsApi } from './api/products-api';
import { appGlobalSlice } from './reducers/app-global';
import { cartSlice } from './reducers/cart-slice';
import { userSlice } from './reducers/user-slice';

export const rootReducer = combineSlices(appGlobalSlice, cartSlice, userSlice, productsApi, cartApi, authApi);
