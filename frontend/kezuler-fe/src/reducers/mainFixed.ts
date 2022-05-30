import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { BFixedEvent, PGetFixedEvents } from 'src/types/fixedEvent';

import { getFixedEvents } from 'src/api/fixedEvent';

const getFixedEventsThunk = createAsyncThunk(
  'getFixedEvents',
  async (params: PGetFixedEvents, { rejectWithValue }) => {
    try {
      const response = await getFixedEvents(params);
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
  events: BFixedEvent[];
}

const initialState: MainFixedState = {
  isFetched: false,
  loading: false,
  errorMessage: '',
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
        const { fixedEvents, userId } = action.payload;
        state.events = fixedEvents;
        state.curUserId = userId;
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
