import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TError } from '../types/axios';
import { BFixedEvent } from 'src/types/fixedEvent';

import { getFixedEvents } from 'src/api/fixedEvent';

const getFixedEventsThunk = createAsyncThunk(
  'getFixedEvents',
  async (
    {
      onFinally,
    }: {
      onFinally?: () => void;
    },
    { rejectWithValue }
  ) => {
    // console.log('here');

    try {
      const response = await getFixedEvents();
      onFinally?.();

      return response.data.result;
    } catch (error) {
      const err = error as TError;
      onFinally?.();
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);

interface MainFixedState {
  isFetched: boolean;
  loading: boolean;
  curUserId: string;
  events: BFixedEvent[];
}

const initialState: MainFixedState = {
  isFetched: false,
  loading: false,
  curUserId: '',
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
        const fixedEvents = action.payload;
        state.events = fixedEvents;
        // state.curUserId = userId;
      })
      .addCase(getFixedEventsThunk.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const mainFixedActions = mainFixed.actions;
export { getFixedEventsThunk };

export default mainFixed.reducer;
