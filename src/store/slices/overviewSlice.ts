import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OverviewStats, Alert, MetricData } from '../../types';
import { fetchOverviewData, acknowledgeAlert as acknowledgeAlertThunk, dismissAlert as dismissAlertThunk } from '../thunks/overviewThunks';

interface OverviewState {
  stats: OverviewStats | null;
  alerts: Alert[];
  metrics: {
    responseTime: MetricData[];
    throughput: MetricData[];
    errorRate: MetricData[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: OverviewState = {
  stats: null,
  alerts: [],
  metrics: {
    responseTime: [],
    throughput: [],
    errorRate: [],
  },
  loading: false,
  error: null,
};

const overviewSlice = createSlice({
  name: 'overview',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Omit<Alert, 'id' | 'timestamp'>>) => {
      const newAlert: Alert = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.alerts.unshift(newAlert);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchOverviewData
      .addCase(fetchOverviewData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverviewData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.alerts = action.payload.alerts;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchOverviewData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle acknowledgeAlert
      .addCase(acknowledgeAlertThunk.fulfilled, (state, action) => {
        const alert = state.alerts.find(a => a.id === action.payload);
        if (alert) {
          alert.acknowledged = true;
        }
      })
      // Handle dismissAlert
      .addCase(dismissAlertThunk.fulfilled, (state, action) => {
        state.alerts = state.alerts.filter(a => a.id !== action.payload);
      });
  },
});

export const {
  addAlert,
} = overviewSlice.actions;

export default overviewSlice.reducer;
