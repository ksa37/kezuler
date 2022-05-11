// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import PendingEvent, { EventTimeCandidate } from '../types/pendingEvent';

interface Coordinate {
  longitude: number;
  latitude: number;
}

const initialState: PendingEvent = {
  userId: '',
  eventId: '',
  eventTitle: '',
  eventDescription: '',
  eventTimeDuration: 60,
  eventTimeCandidates: null,
  isEventOnline: null,
  eventZoomAddress: null,
  eventPlaceLongitude: null,
  eventPlaceLatitude: null,
  eventAttachment: '',
};

export const createMeetingSlice = createSlice({
  name: 'create-meeting',
  initialState,
  reducers: {
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
    setOnOffline: (state, action: PayloadAction<boolean>) => {
      state.isEventOnline = action.payload;
    },
    setZoomAddress: (state, action: PayloadAction<string>) => {
      state.eventZoomAddress = action.payload;
    },
    setCoordinate: (state, action: PayloadAction<Coordinate>) => {
      state.eventPlaceLongitude = action.payload.longitude;
      state.eventPlaceLatitude = action.payload.latitude;
    },
    setAttachment: (state, action: PayloadAction<string>) => {
      state.eventAttachment = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserID,
  setEventID,
  setAttachment,
  setCoordinate,
  setDescription,
  setOnOffline,
  setTimeCandidate,
  setTitle,
  setZoomAddress,
} = createMeetingSlice.actions;

export default createMeetingSlice.reducer;
