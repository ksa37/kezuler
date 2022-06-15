import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TError } from '../types/axios';
import { BFixedEvent, PGetFixedEvents } from 'src/types/fixedEvent';

import { getFixedEvents } from 'src/api/fixedEvent';

const getFixedEventsThunk = createAsyncThunk(
  'getFixedEvents',
  async (params: PGetFixedEvents, { rejectWithValue }) => {
    try {
      const response = await getFixedEvents(params);
      return response.data;
    } catch (error) {
      const err = error as TError;
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);

interface MainFixedState {
  isFetched: boolean;
  loading: boolean;
  errorMessage: string;
  events: BFixedEvent[];
}

const initialState: MainFixedState = {
  isFetched: false,
  loading: false,
  errorMessage: '',
  events: [],
};

export const mainFixed = createSlice({
  name: 'main-fixed',
  initialState,
  reducers: {
    destroy: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFixedEventsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFixedEventsThunk.fulfilled, (state, action) => {
        state.isFetched = true;
        state.loading = false;
        const { fixedEvents, userId } = action.payload;
        state.events = fixedEvents;
      })
      .addCase(getFixedEventsThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = (action.payload as { message: string }).message;
      });
  },
});

export const mainFixedActions = mainFixed.actions;
export { getFixedEventsThunk };

export default mainFixed.reducer;
