import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

export const fetchOverviewData = createAsyncThunk(
  'overview/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getOverviewData();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch overview data');
    }
  }
);

export const acknowledgeAlert = createAsyncThunk(
  'overview/acknowledgeAlert',
  async (alertId: string, { rejectWithValue }) => {
    try {
      await apiService.acknowledgeAlert(alertId);
      return alertId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to acknowledge alert');
    }
  }
);

export const dismissAlert = createAsyncThunk(
  'overview/dismissAlert',
  async (alertId: string, { rejectWithValue }) => {
    try {
      await apiService.dismissAlert(alertId);
      return alertId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to dismiss alert');
    }
  }
);
