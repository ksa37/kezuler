import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PendingEvent } from 'src/types/pendingEvent';

interface ModifySelectionState {
  pendingEvent: PendingEvent;

  eventId: string;
  isDecline: boolean;
  declineReason: null | string;
  availableTimes: string[];
}

const currentPendingEvent: PendingEvent = {
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

const initialState: ModifySelectionState = {
  pendingEvent: currentPendingEvent,

  eventId: '',
  isDecline: true,
  declineReason: null,
  availableTimes: [],
};

const dateSort = (dateArr: string[]) =>
  dateArr.sort((a, b) => new Date(a).valueOf() - new Date(b).valueOf());

export const modifySelectionSlice = createSlice({
  name: 'modify-selection',
  initialState,
  reducers: {
    setPendingEvent: (state, action: PayloadAction<PendingEvent>) => {
      state.pendingEvent = action.payload;
    },
    setEventID: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
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
        (eventTimeCandidate) =>
          new Date(eventTimeCandidate.eventStartsAt).toISOString()
      );
    },
    addAvailableTimes: (state, action: PayloadAction<string>) => {
      state.availableTimes.push(action.payload);
      state.availableTimes = dateSort(state.availableTimes);
    },
    deleteAvailableTimes: (state, action: PayloadAction<string>) => {
      const index = state.availableTimes.indexOf(action.payload);
      if (index !== -1) {
        state.availableTimes.splice(index, 1);
      }
      state.availableTimes = dateSort(state.availableTimes);
    },
  },
});

// Action creators are generated for each case reducer function
export const modifySelectionActions = modifySelectionSlice.actions;

export default modifySelectionSlice.reducer;
