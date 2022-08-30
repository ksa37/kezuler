import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DialogProps } from 'src/types/Dialog';

interface DialogState {
  notiProps: DialogProps | null;
}

const name = 'noti';

const initialState: DialogState = {
  notiProps: null,
};

const reducers = {
  show: (state: DialogState, action: PayloadAction<DialogProps>) => {
    state.notiProps = action.payload;
  },
  hide: () => initialState,
};

const notiSlice = createSlice({ name, initialState, reducers });

export const notiAction = notiSlice.actions;
export default notiSlice.reducer;
