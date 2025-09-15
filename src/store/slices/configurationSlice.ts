import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Configuration } from '../../types';

interface ConfigurationState {
  configurations: Configuration[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: Configuration['category'] | 'all';
}

const initialState: ConfigurationState = {
  configurations: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'all',
};

const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    fetchConfigurationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchConfigurationsSuccess: (state, action: PayloadAction<Configuration[]>) => {
      state.loading = false;
      state.configurations = action.payload;
    },
    fetchConfigurationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateConfiguration: (state, action: PayloadAction<{ id: string; value: Configuration['value'] }>) => {
      const config = state.configurations.find(c => c.id === action.payload.id);
      if (config && config.editable) {
        config.value = action.payload.value;
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Configuration['category'] | 'all'>) => {
      state.selectedCategory = action.payload;
    },
    resetConfiguration: (state, action: PayloadAction<string>) => {
      const config = state.configurations.find(c => c.id === action.payload);
      if (config && config.editable) {
        // Reset to default value logic would go here
        // For now, just simulate reset
        if (config.type === 'boolean') {
          config.value = false;
        } else if (config.type === 'number') {
          config.value = 0;
        } else {
          config.value = '';
        }
      }
    },
  },
});

export const {
  fetchConfigurationsStart,
  fetchConfigurationsSuccess,
  fetchConfigurationsFailure,
  updateConfiguration,
  setSearchTerm,
  setSelectedCategory,
  resetConfiguration,
} = configurationSlice.actions;

export default configurationSlice.reducer;
