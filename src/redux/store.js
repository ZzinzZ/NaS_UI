import { configureStore, combineReducers } from "@reduxjs/toolkit";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loadingReducer from "./slices/LoadingSlice";
import AuthReducer from "./slices/AuthSlice";
import ProfileReducer from "./slices/profileSlice";
import PostReducer from "./slices/PostSlice";
import chatReducer from "./slices/ChatSlice";
import imageReducer from "./slices/imageSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  loading: loadingReducer,
  auth: AuthReducer,
  profile: ProfileReducer,
  posts: PostReducer,
  chat: chatReducer,
  image:imageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
        ignoredPaths: ['register.timestamp'], // Nếu có các path cần bỏ qua
      },
    }),
})

export const persistor = persistStore(store);
export default store;
