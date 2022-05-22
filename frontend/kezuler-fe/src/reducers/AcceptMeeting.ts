import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import mockApi from '../api/mockApi';

export const mockThunkAction = createAsyncThunk(
  'getMock',
  async (userId: string, { rejectWithValue }) => {
    console.log('pending');
    try {
      const response: { data: string } = (await mockApi(userId)) as {
        data: string;
      };
      console.log('fulfilled');
      return response.data;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);

interface AcceptMeetingState {
  // mock up
  loading: boolean;
  data: string;
  errorMessage: string;
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
  loading: false,
  data: '',
  errorMessage: '',
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
