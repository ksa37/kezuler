import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ConfirmMeetingSteps } from 'src/constants/Steps';
import { PendingEvent } from 'src/types/pendingEvent';

interface ConfirmTimeState {
  pendingEvent: PendingEvent;
  selectedTime: number;
  step: ConfirmMeetingSteps;
}

// const currentPendingEvent: PendingEvent = {
//   userId: '',
//   eventId: '',
//   eventHost: { userId: '', userName: '', userProfileImage: '' },
//   eventTitle: '',
//   eventDescription: '',
//   eventTimeDuration: 60,
//   declinedUsers: [],
//   eventTimeCandidates: [],
//   eventZoomAddress: '',
//   eventPlace: '',
//   eventAttachment: '',
// };

const currentPendingEvent: PendingEvent = {
  eventId: 'pendingevt01',
  eventHost: {
    userId: 'user0001',
    userName: '...',
    userProfileImage: '...',
  },
  eventTitle: '17학번 회식',
  eventDescription: '...',
  eventTimeDuration: 60,
  declinedUsers: [
    {
      userId: 'user0004',
      userName: '...',
      userProfileImage: '...',
      userDeclineReason: '...',
    },
    {
      userId: 'user0005',
      userName: '...',
      userProfileImage: '...',
      userDeclineReason: '...',
    },
  ],
  eventTimeCandidates: [
    {
      eventStartsAt: 1649664000000,
      possibleUsers: [
        {
          userId: 'user0002',
          userName: '...',
          userProfileImage: '...',
        },
        {
          userId: 'user0003',
          userName: '...',
          userProfileImage: '...',
        },
      ],
    },
    {
      eventStartsAt: 1649682000000,
      possibleUsers: [
        {
          userId: 'user0002',
          userName: '...',
          userProfileImage: '...',
        },
      ],
    },
    {
      eventStartsAt: 1649703600000,
      possibleUsers: [],
    },
  ],
  eventZoomAddress: '',
  eventPlace: '...',
  eventAttachment: '...',
};

const initialState: ConfirmTimeState = {
  pendingEvent: currentPendingEvent,
  selectedTime: 0,
  step: ConfirmMeetingSteps.First,
};

export const confirmTimeSlice = createSlice({
  name: 'confirm-time',
  initialState,
  reducers: {
    increaseStep: (state) => {
      state.step += 1;
    },
    decreaseStep: (state) => {
      state.step -= 1;
    },
    setPendingEvent: (state, action: PayloadAction<PendingEvent>) => {
      state.pendingEvent = action.payload;
    },
    setSelctedTime: (state, action: PayloadAction<number>) => {
      state.selectedTime = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const confirmTimeActions = confirmTimeSlice.actions;

export default confirmTimeSlice.reducer;
