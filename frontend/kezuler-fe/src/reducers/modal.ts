import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ModalPayloadType, ModalType } from 'src/types/Modal';

interface ModalState<T extends ModalType> {
  modalInfo: ModalPayloadType<T> | null;
}

const name = 'modal';

const initialState: ModalState<ModalType> = {
  modalInfo: null,
};

const reducers = {
  show: (
    state: ModalState<ModalType>,
    action: PayloadAction<ModalPayloadType<ModalType>>
  ) => {
    state.modalInfo = action.payload;
  },
  hide: () => initialState,
};

const modalSlice = createSlice({ name, initialState, reducers });

export const modalAction = modalSlice.actions;
export default modalSlice.reducer;
