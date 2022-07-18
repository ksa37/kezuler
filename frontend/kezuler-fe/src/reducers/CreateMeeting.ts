// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CreateMeetingSteps } from 'src/constants/Steps';
import { PPostPendingEvent } from 'src/types/pendingEvent';

interface CreateMeetingState extends PPostPendingEvent {
  step: CreateMeetingSteps;
  eventId: string;
  shareUrl: string;
  isOnline: null | boolean;
  eventTimeList: number[];
}

const initialState: CreateMeetingState = {
  step: CreateMeetingSteps.First,
  eventId: '',
  shareUrl: '',
  isOnline: null,
  eventTimeList: [],
  eventTitle: '',
  eventDescription: '',
  eventTimeDuration: 60,
  eventTimeCandidates: [],
  eventZoomAddress: '',
  eventPlace: '',
  eventAttachment: '',
};

const dateSort = (dateArr: number[]) => dateArr.sort((a, b) => a - b);

export const createMeetingSlice = createSlice({
  name: 'create-meeting',
  initialState,
  reducers: {
    setShareUrl: (state, action: PayloadAction<string>) => {
      state.shareUrl = action.payload;
    },
    setEventId: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
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
    setEventTimeDuration: (state, action: PayloadAction<number>) => {
      state.eventTimeDuration = action.payload;
    },
    addTimeList: (state, action: PayloadAction<number>) => {
      state.eventTimeList.push(action.payload);
      state.eventTimeList = dateSort(state.eventTimeList);
    },
    deleteTimeList: (state, action: PayloadAction<number>) => {
      const index = state.eventTimeList.indexOf(action.payload);
      if (index !== -1) {
        state.eventTimeList.splice(index, 1);
      }
      state.eventTimeList = dateSort(state.eventTimeList);
    },
    setEventTimeCandidates: (state, action: PayloadAction<number[]>) => {
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
