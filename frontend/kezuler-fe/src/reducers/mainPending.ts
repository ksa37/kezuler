import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TError } from '../types/axios';
import { BPendingEvent } from 'src/types/pendingEvent';

import { getPendingEvents } from 'src/api/pendingEvent';

const getPendingEventsThunk = createAsyncThunk(
  'getPendingEvents',
  async (_: Record<string, never>, { rejectWithValue }) => {
    try {
      // const response = await getPendingEvents();
      // return response.data;
      return {
        pendingEvents: [
          {
            eventHostId: '001',
            eventId: '001',
            eventTitle: '이벤트 제목',
            eventDescription: '이벤트 설명입니다.',
            eventTimeDuration: 60,
            declinedUsers: [],
            eventTimeCandidates: [],
            eventZoomAddress: '',
            eventPlace: '우리 집',
            eventAttachment: '이게 뭐지',
          },
        ],
        userId: '001',
      };
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
