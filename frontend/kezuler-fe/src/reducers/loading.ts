import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  loading: boolean;
}

const name = 'loading';

const initialState: LoadingState = {
  loading: false,
};

const reducers = {
  setLoading: (state: LoadingState, action: PayloadAction<boolean>) => {
    state.loading = action.payload;
  },
};

const loadingSlice = createSlice({ name, initialState, reducers });

export const loadingAction = loadingSlice.actions;
export default loadingSlice.reducer;
