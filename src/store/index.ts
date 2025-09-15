import { configureStore } from '@reduxjs/toolkit';
import overviewReducer from './slices/overviewSlice';
import servicesReducer from './slices/servicesSlice';
import situationsReducer from './slices/situationsSlice';
import configurationReducer from './slices/configurationSlice';

export const store = configureStore({
  reducer: {
    overview: overviewReducer,
    services: servicesReducer,
    situations: situationsReducer,
    configuration: configurationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
