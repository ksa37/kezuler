import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DialogProps } from 'src/types/Dialog';

interface DialogState {
  dialogProps: DialogProps | null;
}

const name = 'dialog';

const initialState: DialogState = {
  dialogProps: null,
};

const reducers = {
  show: (state: DialogState, action: PayloadAction<DialogProps>) => {
    state.dialogProps = action.payload;
  },
  hide: () => initialState,
};

const dialogSlice = createSlice({ name, initialState, reducers });

export const dialogAction = dialogSlice.actions;
export default dialogSlice.reducer;
