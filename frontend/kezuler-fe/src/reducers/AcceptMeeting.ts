import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BFixedEvent } from 'src/types/fixedEvent';
import { PendingEvent } from 'src/types/pendingEvent';

interface AcceptMeetingState {
  isLoaded: boolean;
  pendingEvent: PendingEvent;
  fixedEvent: BFixedEvent;
  isDecline: boolean;
  declineReason: null | string;
  availableTimes: number[];
}

const initialPendingEvent: PendingEvent = {
  eventId: '',
  eventHost: { userId: '', userName: '', userProfileImage: '' },
  eventTitle: '',
  eventDescription: '',
  eventTimeDuration: 60,
  declinedUsers: [],
  eventTimeCandidates: [],

  addressType: '',
  addressDetail: '',
  eventAttachment: '',
  disable: false,
  state: '',
};

const initialFixedEvent: BFixedEvent = {
  eventId: '',
  eventHost: {
    userId: '',
    userName: '',
    userProfileImage: '',
    userStatus: undefined,
  },
  eventTitle: '',
  eventDescription: '',
  eventTimeDuration: 60,
  eventTimeStartsAt: 0,
  participants: [],
  addressType: '',
  addressDetail: '',
  eventAttachment: '',
  disable: false,
  state: '',
};

const initialState: AcceptMeetingState = {
  isLoaded: false,

  pendingEvent: initialPendingEvent,
  fixedEvent: initialFixedEvent,

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
    setPendingEvent: (state, action: PayloadAction<PendingEvent>) => {
      state.pendingEvent = action.payload;
    },
    setFixedEvent: (state, action: PayloadAction<BFixedEvent>) => {
      state.fixedEvent = action.payload;
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
      if (state.pendingEvent.eventTimeCandidates) {
        state.availableTimes = state.pendingEvent.eventTimeCandidates.map(
          (eventTimeCandidate) => eventTimeCandidate.eventStartsAt
        );
      }
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
});

// Action creators are generated for each case reducer function
export const acceptMeetingActions = acceptMeetingSlice.actions;

export default acceptMeetingSlice.reducer;
