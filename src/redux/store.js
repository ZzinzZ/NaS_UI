"use client"
import { configureStore } from '@reduxjs/toolkit';
import loadingReducer  from './slices/LoadingSlice';
import AuthReducer from './slices/AuthSlice';
import registerReducer from './slices/RegisterSlice';

const store = configureStore({
    reducer: {
      loading: loadingReducer,
      auth: AuthReducer,
      register: registerReducer,

    }
  });

  export default store;