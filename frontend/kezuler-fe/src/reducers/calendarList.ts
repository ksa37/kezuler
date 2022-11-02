import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ScehdulesEachDay } from 'src/types/calendar';

interface CalendarState {
  calendarList: ScehdulesEachDay;
}

const name = 'calendarList';

const initialState: CalendarState = {
  calendarList: {},
};

const reducers = {
  setCalendarList: (
    state: CalendarState,
    action: PayloadAction<ScehdulesEachDay>
  ) => {
    state.calendarList = action.payload;
  },
  destroy: () => initialState,
};

const calendarSlice = createSlice({ name, initialState, reducers });

export const calendarActions = calendarSlice.actions;
export default calendarSlice.reducer;
