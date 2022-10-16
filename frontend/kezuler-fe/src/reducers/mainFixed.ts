import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TError } from '../types/axios';
import { BFixedEvent } from 'src/types/fixedEvent';

import { getFixedEvents } from 'src/api/fixedEvent';

const getFixedEventsThunk = createAsyncThunk(
  'getFixedEvents',
  async (
    {
      onFinally,
      page,
    }: {
      onFinally?: () => void;
      page: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getFixedEvents(page);
      onFinally?.();

      return { page: page, events: response.data.result };
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
  nextPage: number;
  isBtmEnd: boolean;
  prePage: number;
  isTopEnd: boolean;
}

const initialState: MainFixedState = {
  isFetched: false,
  loading: false,
  curUserId: '',
  events: [],
  nextPage: 0,
  isBtmEnd: false,
  prePage: 0,
  isTopEnd: false,
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
        const { page, events: fixedEvents } = action.payload;
        if (page >= 0) {
          state.nextPage = page + 1;
          if (page === 0) state.prePage = page - 1;
          if (fixedEvents.length < 15) state.isBtmEnd = true;
          state.events = [...state.events, ...fixedEvents];
        } else if (page < 0) {
          state.prePage = page - 1;
          if (fixedEvents.length < 15) state.isTopEnd = true;
          state.events = [...fixedEvents, ...state.events];
        }
      })
      .addCase(getFixedEventsThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const mainFixedActions = mainFixed.actions;
export { getFixedEventsThunk };

export default mainFixed.reducer;
