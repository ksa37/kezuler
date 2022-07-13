import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TError } from '../types/axios';
import { BPendingEvent } from 'src/types/pendingEvent';

import { getPendingEvents } from 'src/api/pendingEvent';

const getPendingEventsThunk = createAsyncThunk(
  'getPendingEvents',
  async ({ onFinally }: { onFinally?: () => void }, { rejectWithValue }) => {
    try {
      const response = await getPendingEvents();
      onFinally?.();
      return response.data;
      // return {
      //   pendingEvents: [
      //     {
      //       eventHostId: '001',
      //       eventId: '001',
      //       eventTitle: '이벤트 제목',
      //       eventDescription: '이벤트 설명입니다.',
      //       eventTimeDuration: 60,
      //       declinedUsers: [],
      //       eventTimeCandidates: [],
      //       eventZoomAddress: '',
      //       eventPlace: '우리 집',
      //       eventAttachment: '이게 뭐지',
      //     },
      //   ],
      //   userId: '001',
      // };
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
}

const initialState: MainPendingState = {
  isFetched: false,
  loading: false,
  errorMessage: '',
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
        const { pendingEvents } = action.payload;
        state.events = pendingEvents;
      })
      .addCase(getPendingEventsThunk.rejected, (state, action) => {
        state.loading = false;
        // state.errorMessage = (action.payload as { message: string }).message;
      });
  },
});

export const mainPendingActions = mainPending.actions;
export { getPendingEventsThunk };

export default mainPending.reducer;
