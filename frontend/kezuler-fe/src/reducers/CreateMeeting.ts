// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CreateMeetingSteps } from 'src/constants/Steps';
import { PendingEvent } from 'src/types/pendingEvent';

interface CreateMeetingState extends PendingEvent {
  step: CreateMeetingSteps;
  shareUrl: string;
  isOnline: null | boolean;
  eventTimeList: string[];
}

const initialState: CreateMeetingState = {
  step: CreateMeetingSteps.First,
  shareUrl: '',
  isOnline: null,
  eventTimeList: [],
  userId: '',
  eventHost: { userId: '', userName: '', userProfileImage: '' },
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

const dateSort = (dateArr: string[]) =>
  dateArr.sort((a, b) => new Date(a).valueOf() - new Date(b).valueOf());

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
    addTimeList: (state, action: PayloadAction<string>) => {
      state.eventTimeList.push(action.payload);
      state.eventTimeList = dateSort(state.eventTimeList);
    },
    deleteTimeList: (state, action: PayloadAction<string>) => {
      const index = state.eventTimeList.indexOf(action.payload);
      if (index !== -1) {
        state.eventTimeList.splice(index, 1);
      }
      state.eventTimeList = dateSort(state.eventTimeList);
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
