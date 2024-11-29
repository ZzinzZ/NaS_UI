import { configureStore,combineReducers } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import loadingReducer from './slices/LoadingSlice';
import AuthReducer from './slices/AuthSlice';
import ProfileReducer from './slices/profileSlice';
import PostReducer from './slices/PostSlice';
import chatReducer from './slices/ChatSlice';

// Cấu hình Redux Persist
const persistConfig = {
  key: 'root',  // Đặt là 'root' để lưu toàn bộ root reducer
  storage,
  whitelist: ['auth'],
  stateReconciler: autoMergeLevel2,
};

// Kết hợp tất cả reducer
const rootReducer = combineReducers({
  loading: loadingReducer,
  auth: AuthReducer,
  profile: ProfileReducer,
  posts: PostReducer,
  chat: chatReducer,
});

// Áp dụng persist cho root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;