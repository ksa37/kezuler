import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AcceptMeetingSteps } from 'src/constants/Steps';
import { TError } from '../types/axios';
import { PendingEvent } from 'src/types/pendingEvent';

import mockApi from 'src/api/mockApi';

export const mockThunkAction = createAsyncThunk(
  'getMock',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response: { data: string } = (await mockApi(userId)) as {
        data: string;
      };
      return response.data;
    } catch (error) {
      const err = error as TError;
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);

interface AcceptMeetingState {
  // mock up
  loading: boolean;
  data: string;
  errorMessage: string;

  step: AcceptMeetingSteps;

  pendingEvent: PendingEvent;

  eventId: string;
  userId?: string;
  userName?: string;
  isDecline: boolean;
  declineReason: null | string;
  availableTimes: TimeCandidate[];
}

type TimeCandidate = { [date: string]: string[] };

const initialPendingEvent: PendingEvent = {
  userId: '',
  eventId: '',
  eventHostId: '',
  eventTitle: '',
  eventDescription: '',
  eventTimeDuration: 60,
  declinedUsers: [],
  eventTimeCandidates: [],
  eventZoomAddress: '',
  eventPlace: '',
  eventAttachment: '',
};

const initialState: AcceptMeetingState = {
  loading: false,
  data: '',
  errorMessage: '',

  step: AcceptMeetingSteps.First,

  pendingEvent: initialPendingEvent,

  eventId: '',
  userId: '',
  userName: '',
  isDecline: false,
  declineReason: null,
  availableTimes: [],
};

export const acceptMeetingSlice = createSlice({
  name: 'accept-meeting',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    increaseStep: (state) => {
      state.step += 1;
    },
    decreaseStep: (state) => {
      state.step -= 1;
    },
    setPendingEvent: (state, action: PayloadAction<PendingEvent>) => {
      state.pendingEvent = action.payload;
    },
    setUserID: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setEventID: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setIsDecline: (state, action: PayloadAction<boolean>) => {
      state.isDecline = action.payload;
    },
    setDeclineReason: (state, action: PayloadAction<string>) => {
      state.declineReason = action.payload;
    },
    setAvailableTimes: (state, action: PayloadAction<TimeCandidate[]>) => {
      state.availableTimes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(mockThunkAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(mockThunkAction.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(mockThunkAction.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = (action.payload as { message: string }).message;
      });
  },
});

// Action creators are generated for each case reducer function
export const acceptMeetingActions = acceptMeetingSlice.actions;

export default acceptMeetingSlice.reducer;
