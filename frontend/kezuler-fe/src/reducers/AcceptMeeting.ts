import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PendingEvent } from 'src/types/pendingEvent';

interface AcceptMeetingState {
  // mock up
  loading: boolean;
  data: string;

  isLoaded: boolean;
  // step: AcceptMeetingSteps;

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
  addressType: '',
  addressDetail: '',
  eventAttachment: '',
  disable: false,
};

const initialState: AcceptMeetingState = {
  loading: false,
  data: '',

  isLoaded: false,
  // step: AcceptMeetingSteps.First,

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
    // setStep: (state, action: PayloadAction<number>) => {
    //   state.step = action.payload;
    // },
    // increaseStep: (state) => {
    //   state.step += 1;
    // },
    // decreaseStep: (state) => {
    //   state.step -= 1;
    // },
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
      // 현재 시각 기준 가능한 미팅만 선택
      state.availableTimes = state.pendingEvent.eventTimeCandidates.reduce<number[]>(
        (prev, {eventStartsAt}) =>{
          if (eventStartsAt > new Date().getTime()) {
            return [...prev, eventStartsAt]
          }
          return prev
        }, []
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
});

// Action creators are generated for each case reducer function
export const acceptMeetingActions = acceptMeetingSlice.actions;

export default acceptMeetingSlice.reducer;
