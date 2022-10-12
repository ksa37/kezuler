import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TError } from '../types/axios';
import { BPendingEvent } from 'src/types/pendingEvent';

import { getPendingEvents } from 'src/api/pendingEvent';

const getPendingEventsThunk = createAsyncThunk(
  'getPendingEvents',
  async (
    { onFinally, page }: { onFinally?: () => void; page: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await getPendingEvents(page);
      onFinally?.();
      return { page: page, events: response.data.result };
    } catch (error) {
      const err = error as TError;
      onFinally?.();
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);

interface MainPendingState {
  isFetched: boolean;
  loading: boolean;
  errorMessage: string;
  events: BPendingEvent[];
  nextPage: number;
  isEnd: boolean;
}

const initialState: MainPendingState = {
  isFetched: false,
  loading: false,
  errorMessage: '',
  events: [],
  nextPage: 0,
  isEnd: false,
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
        const { page, events: pendingEvents } = action.payload;
        state.nextPage = page + 1;
        if (pendingEvents.length < 15) state.isEnd = true;
        state.events = [...state.events, ...pendingEvents];
      })
      .addCase(getPendingEventsThunk.rejected, (state) => {
        state.loading = false;

        // state.errorMessage = (action.payload as { message: string }).message;
      });
  },
});

export const mainPendingActions = mainPending.actions;
export { getPendingEventsThunk };

export default mainPending.reducer;
