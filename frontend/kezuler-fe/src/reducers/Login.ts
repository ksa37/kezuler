import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoginState {
  value: number;
}

const initialState: LoginState = {
  value: 0,
};

export const loginSlice = createSlice({
  name: 'kakao-login',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = loginSlice.actions;

export default loginSlice.reducer;
