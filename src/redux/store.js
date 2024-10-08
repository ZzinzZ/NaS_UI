import { configureStore,combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import loadingReducer from './slices/LoadingSlice';
import AuthReducer from './slices/AuthSlice';
import ProfileReducer from './slices/profileSlice';
import RegisterReducer from './slices/RegisterSlice';
import PostReducer from './slices/PostSlice';

// Cấu hình Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = {
  loading: loadingReducer,
  auth: AuthReducer,
  profile: ProfileReducer,
  register: RegisterReducer,
  posts: PostReducer
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
