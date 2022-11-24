import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreateStorageState {
  storageType: string;
  storageTitle: string;
  storageMemoContent: string;
  storageLinkContent: string;
}

const initialState: CreateStorageState = {
  storageType: '',
  storageTitle: '',
  storageMemoContent: '',
  storageLinkContent: '',
};

export const createStorageSlice = createSlice({
  name: 'create-storage',
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<string>) => {
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
