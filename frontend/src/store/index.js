import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import filesReducer from './filesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'files/setFiles',
          'files/addFile',
          'files/updateFile',
          'auth/login/fulfilled',
          'auth/fetchCurrentUser/fulfilled',
        ],
        ignoredPaths: ['files.list.uploaded_at'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
