import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryStorageState {
  eventTitle: string;
}

const initialState: HistoryStorageState = {
  eventTitle: '',
};

export const historyStorageSlice = createSlice({
  name: 'history-storage',
  initialState,
  reducers: {
    setEventTitle: (state, action: PayloadAction<string>) => {
      state.eventTitle = action.payload;
    },
    destroy: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const historyStorageActions = historyStorageSlice.actions;

export default historyStorageSlice.reducer;
