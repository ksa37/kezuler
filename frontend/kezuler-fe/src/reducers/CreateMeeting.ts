// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CreateMeetingSteps } from 'src/constants/Steps';
import { EventTimeCandidate, PendingEvent } from 'src/types/pendingEvent';

interface CreateMeetingState extends PendingEvent {
  step: CreateMeetingSteps;
  shareUrl: string;
  isOnline: null | boolean;
}

const initialState: CreateMeetingState = {
  step: CreateMeetingSteps.First,
  shareUrl: '',
  isOnline: null,
  userId: '',
  eventId: '',
  eventTitle: '',
  eventDescription: '',
  eventTimeDuration: 60,
  declinedUsers: [],
  eventTimeCandidates: [],
  eventZoomAddress: '',
  eventPlace: '',
  eventAttachment: '',
};

export const createMeetingSlice = createSlice({
  name: 'create-meeting',
  initialState,
  reducers: {
    setShareUrl: (state, action: PayloadAction<string>) => {
      state.shareUrl = action.payload;
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
    setIsOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setUserID: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setEventID: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
    },
    setTimeCandidate: (state, action: PayloadAction<EventTimeCandidate[]>) => {
      state.eventTimeCandidates = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.eventTitle = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.eventDescription = action.payload;
    },
    setZoomAddress: (state, action: PayloadAction<string>) => {
      state.eventZoomAddress = action.payload;
    },
    setPlace: (state, action: PayloadAction<string>) => {
      state.eventPlace = action.payload;
    },
    setAttachment: (state, action: PayloadAction<string>) => {
      state.eventAttachment = action.payload;
    },
    destroy: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const createMeetingActions = createMeetingSlice.actions;

export default createMeetingSlice.reducer;
