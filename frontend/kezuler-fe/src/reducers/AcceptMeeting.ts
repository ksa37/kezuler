import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AcceptMeetingState {
  eventId: string;
  userId?: string;
  userName?: string;
  userPhoneNumber?: string;
  isDecline: boolean;
  declineReason: null | string;
  availableTimes: null | TimeCandidate[];
}

interface UserInfo {
  userName: string;
  userPhoneNumber: string;
}

type TimeCandidate = Record<string, string[]>;

const initialState: AcceptMeetingState = {
  eventId: '',
  userId: '',
  userName: '',
  userPhoneNumber: '',
  isDecline: false,
  declineReason: null,
  availableTimes: null,
};

export const acceptMeetingSlice = createSlice({
  name: 'accept-meeting',
  initialState,
  reducers: {
    setUserID: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setEventID: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userName = action.payload.userName;
      state.userPhoneNumber = action.payload.userPhoneNumber;
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
});

// Action creators are generated for each case reducer function
export const {
  setUserID,
  setEventID,
  setUserInfo,
  setIsDecline,
  setDeclineReason,
  setAvailableTimes,
} = acceptMeetingSlice.actions;

export default acceptMeetingSlice.reducer;
