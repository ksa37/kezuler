import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ShareProps } from 'src/types/Dialog';

interface ShareState {
  shareProps: ShareProps | null;
}

const name = 'share';

const initialState: ShareState = {
  shareProps: null,
};

const reducers = {
  show: (state: ShareState, action: PayloadAction<ShareProps>) => {
    state.shareProps = action.payload;
  },
  hide: () => initialState,
};

const shareSlice = createSlice({ name, initialState, reducers });

export const shareAction = shareSlice.actions;
export default shareSlice.reducer;
