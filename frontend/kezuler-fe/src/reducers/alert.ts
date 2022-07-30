import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AlertProps } from 'src/types/Dialog';

interface AlertState {
  alertProps: AlertProps | null;
}

const name = 'alert';

const initialState: AlertState = {
  alertProps: null,
};

const reducers = {
  show: (state: AlertState, action: PayloadAction<AlertProps>) => {
    state.alertProps = action.payload;
  },
  hide: () => initialState,
};

const alertSlice = createSlice({ name, initialState, reducers });

export const alertAction = alertSlice.actions;
export default alertSlice.reducer;
