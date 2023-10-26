import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { StorageType } from '../types/Storage';

interface CreateStorageState {
  storageType?: StorageType;
  storageTitle: string;
  storageMemoContent: string;
  storageLinkContent: string;
}

const initialState: CreateStorageState = {
  storageTitle: '',
  storageMemoContent: '',
  storageLinkContent: '',
};

export const createStorageSlice = createSlice({
  name: 'create-storage',
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<StorageType>) => {
      state.storageType = action.payload;
    },
    setMemoContent: (state, action: PayloadAction<string>) => {
      state.storageMemoContent = action.payload;
    },
    setLinkContent: (state, action: PayloadAction<string>) => {
      state.storageLinkContent = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.storageTitle = action.payload;
    },
    destroy: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const createStorageActions = createStorageSlice.actions;

export default createStorageSlice.reducer;
