import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryStorageState {
  prevUrl: string;
  eventTitle: string;
}

const initialState: HistoryStorageState = {
  prevUrl: '',
  eventTitle: '',
};

export const historyStorageSlice = createSlice({
  name: 'history-storage',
  initialState,
  reducers: {
    setPrevUrl: (state, action: PayloadAction<string>) => {
      state.prevUrl = action.payload;
    },
    setEventTitle: (state, action: PayloadAction<string>) => {
      state.eventTitle = action.payload;
    },
    destroy: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const historyStorageActions = historyStorageSlice.actions;

export default historyStorageSlice.reducer;
