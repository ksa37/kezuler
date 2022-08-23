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

  isLoaded: boolean;
  step: AcceptMeetingSteps;

  pendingEvent: PendingEvent;

  eventId: string;
  userId?: string;
  userName?: string;
  isDecline: boolean;
  declineReason: null | string;
  availableTimes: number[];
}

const initialPendingEvent: PendingEvent = {
  userId: '',
  eventId: '',
  eventHost: { userId: '', userName: '', userProfileImage: '' },
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

  isLoaded: false,
  step: AcceptMeetingSteps.First,

  pendingEvent: initialPendingEvent,

  eventId: '',
  userId: '',
  userName: '',
  isDecline: false,

  declineReason: null,
  availableTimes: [],
};

const dateSort = (dateArr: number[]) => dateArr.sort((a, b) => a - b);

export const acceptMeetingSlice = createSlice({
  name: 'accept-meeting',
  initialState,
  reducers: {
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
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
    clearAvailableTimes: (state) => {
      state.availableTimes = [];
    },
    setAllAvailableTimes: (state) => {
      state.availableTimes = state.pendingEvent.eventTimeCandidates.map(
        (eventTimeCandidate) => eventTimeCandidate.eventStartsAt
      );
    },
    setAvailableTimes: (state, action: PayloadAction<number[]>) => {
      state.availableTimes = action.payload;
      state.availableTimes = dateSort(state.availableTimes);
    },
    addAvailableTimes: (state, action: PayloadAction<number>) => {
      state.availableTimes.push(action.payload);
      state.availableTimes = dateSort(state.availableTimes);
    },
    deleteAvailableTimes: (state, action: PayloadAction<number>) => {
      const index = state.availableTimes.indexOf(action.payload);
      if (index !== -1) {
        state.availableTimes.splice(index, 1);
      }
      state.availableTimes = dateSort(state.availableTimes);
    },
    destroy: () => initialState,
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
