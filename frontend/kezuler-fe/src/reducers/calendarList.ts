import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ScehdulesEachDay } from 'src/types/calendar';

interface CalendarState {
  calendarList: ScehdulesEachDay;
  loaded: boolean;
}

const name = 'calendarList';

const initialState: CalendarState = {
  calendarList: {},
  loaded: false,
};

const reducers = {
  setCalendarList: (
    state: CalendarState,
    action: PayloadAction<ScehdulesEachDay>
  ) => {
    state.calendarList = action.payload;
  },
  setCalendarLoaded: (state: CalendarState, action: PayloadAction<boolean>) => {
    state.loaded = action.payload;
  },
  destroy: () => initialState,
};

const calendarSlice = createSlice({ name, initialState, reducers });

export const calendarActions = calendarSlice.actions;
export default calendarSlice.reducer;
