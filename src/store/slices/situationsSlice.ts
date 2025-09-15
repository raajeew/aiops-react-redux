import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Situation } from '../../types';

interface SituationsState {
  situations: Situation[];
  loading: boolean;
  error: string | null;
  selectedSituation: Situation | null;
  filters: {
    severity: Situation['severity'] | 'all';
    status: Situation['status'] | 'all';
  };
}

const initialState: SituationsState = {
  situations: [],
  loading: false,
  error: null,
  selectedSituation: null,
  filters: {
    severity: 'all',
    status: 'all',
  },
};

const situationsSlice = createSlice({
  name: 'situations',
  initialState,
  reducers: {
    fetchSituationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSituationsSuccess: (state, action: PayloadAction<Situation[]>) => {
      state.loading = false;
      state.situations = action.payload;
    },
    fetchSituationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectSituation: (state, action: PayloadAction<Situation>) => {
      state.selectedSituation = action.payload;
    },
    updateSituationStatus: (state, action: PayloadAction<{ id: string; status: Situation['status'] }>) => {
      const situation = state.situations.find(s => s.id === action.payload.id);
      if (situation) {
        situation.status = action.payload.status;
        situation.updated = new Date().toISOString();
      }
    },
    setFilters: (state, action: PayloadAction<Partial<SituationsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    createSituation: (state, action: PayloadAction<Omit<Situation, 'id' | 'created' | 'updated'>>) => {
      const newSituation: Situation = {
        ...action.payload,
        id: Date.now().toString(),
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };
      state.situations.unshift(newSituation);
    },
  },
});

export const {
  fetchSituationsStart,
  fetchSituationsSuccess,
  fetchSituationsFailure,
  selectSituation,
  updateSituationStatus,
  setFilters,
  createSituation,
} = situationsSlice.actions;

export default situationsSlice.reducer;
