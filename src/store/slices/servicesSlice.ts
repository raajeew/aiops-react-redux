import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Service } from '../../types';
import { fetchServices, updateServiceStatus as updateServiceStatusThunk, createService } from '../thunks/servicesThunks';

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
  selectedService: Service | null;
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
  selectedService: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    selectService: (state, action: PayloadAction<Service>) => {
      state.selectedService = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchServices
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle updateServiceStatus
      .addCase(updateServiceStatusThunk.pending, (state) => {
        console.log('Redux: Updating service status - pending');
      })
      .addCase(updateServiceStatusThunk.fulfilled, (state, action) => {
        console.log('Redux: Updating service status - fulfilled', action.payload);
        const { id, status, health } = action.payload;
        const service = state.services.find(s => s.id === id);
        if (service) {
          console.log('Redux: Found service to update:', service.name);
          service.status = status;
          service.health = health;
          service.lastUpdated = new Date().toISOString();
          console.log('Redux: Service updated successfully');
        } else {
          console.log('Redux: Service not found with id:', id);
        }
      })
      .addCase(updateServiceStatusThunk.rejected, (state, action) => {
        console.log('Redux: Updating service status - rejected', action.payload);
        state.error = action.payload as string;
      })
      // Handle createService
      .addCase(createService.pending, (state) => {
        console.log('Redux: Creating service - pending');
        state.loading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        console.log('Redux: Creating service - fulfilled', action.payload);
        state.loading = false;
        state.services.push(action.payload);
        console.log('Redux: Total services after creation:', state.services.length);
      })
      .addCase(createService.rejected, (state, action) => {
        console.log('Redux: Creating service - rejected', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectService,
} = servicesSlice.actions;

export default servicesSlice.reducer;
