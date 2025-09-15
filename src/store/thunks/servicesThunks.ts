import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import type { Service } from '../../types';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const services = await apiService.getServices();
      return services;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const service = await apiService.getServiceById(id);
      if (!service) {
        throw new Error('Service not found');
      }
      return service;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch service');
    }
  }
);

export const updateServiceStatus = createAsyncThunk(
  'services/updateStatus',
  async (
    { id, status, health }: { id: string; status: Service['status']; health: number },
    { rejectWithValue }
  ) => {
    try {
      const updatedService = await apiService.updateServiceStatus(id, status, health);
      return { id, status, health: updatedService.health };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update service status');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (
    serviceData: Omit<Service, 'id' | 'lastUpdated' | 'health' | 'responseTime' | 'uptime'>,
    { rejectWithValue }
  ) => {
    try {
      const newService = await apiService.createService(serviceData);
      return newService;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create service');
    }
  }
);
