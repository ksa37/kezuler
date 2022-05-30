import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { BPendingEvent } from 'src/types/pendingEvent';

import { getPendingEvents } from 'src/api/pendingEvent';

const getPendingEventsThunk = createAsyncThunk(
  'getPendingEvents',
  async (_: Record<string, never>, { rejectWithValue }) => {
    try {
      const response = await getPendingEvents();
      return response.data;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);

interface MainFixedState {
  isFetched: boolean;
  loading: boolean;
  errorMessage: string;
  curUserId: string;
  events: BPendingEvent[];
}

const initialState: MainFixedState = {
  isFetched: false,
  loading: false,
  errorMessage: '',
  curUserId: '',
  events: [],
};

export const mainPending = createSlice({
  name: 'main-pending',
  initialState,
  reducers: {
    destroy: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPendingEventsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPendingEventsThunk.fulfilled, (state, action) => {
        state.isFetched = true;
        state.loading = false;
        const { pendingEvents, userId } = action.payload;
        state.events = pendingEvents;
        state.curUserId = userId;
      })
      .addCase(getPendingEventsThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = (action.payload as { message: string }).message;
      });
  },
});

export const mainPendingActions = mainPending.actions;
export { getPendingEventsThunk };

export default mainPending.reducer;
