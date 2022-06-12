import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';

interface ParticipantsPopupState {
  isOpen: boolean;
  event: BFixedEvent | BPendingEvent | null;
}

const name = 'participants';

const initialState: ParticipantsPopupState = {
  isOpen: false,
  event: null,
};

const reducers = {
  show: (
    state: ParticipantsPopupState,
    action: PayloadAction<BFixedEvent | BPendingEvent>
  ) => {
    state.isOpen = true;
    state.event = action.payload;
  },
  hide: () => initialState,
};
const participantsPopupSlice = createSlice({ name, initialState, reducers });

export const participantsPopupAction = participantsPopupSlice.actions;
export default participantsPopupSlice.reducer;
