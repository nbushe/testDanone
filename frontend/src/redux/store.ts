// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import intervalReducer from './intervalSlice';

const store = configureStore({
  reducer: {
    interval: intervalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Отключаем проверку сериализации
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;