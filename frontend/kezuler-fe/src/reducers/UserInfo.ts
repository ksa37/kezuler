import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TError } from '../types/axios';
import { User } from 'src/types/user';

import { getUserById } from 'src/api/user';

export const getUserInfoThunk = createAsyncThunk(
  'getUserInfo',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await getUserById(userId);
      return response.data;
    } catch (error) {
      const err = error as TError;
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);

interface UserInfoState extends User {
  loading: boolean;
  errorMessage: string;
}

const initialState: UserInfoState = {
  loading: false,
  errorMessage: '',
  userId: '',
  userName: '',
  userProfileImage: '',
};

export const userInfoSlice = createSlice({
  name: 'c',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfoThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfoThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, userName, userProfileImage } = action.payload;
        state.userId = userId;
        state.userName = userName;
        state.userProfileImage = userProfileImage;
      })
      .addCase(getUserInfoThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = (action.payload as { message: string }).message;
      });
  },
});

// Action creators are generated for each case reducer function
export const hostInfoActions = userInfoSlice.actions;

export default userInfoSlice.reducer;
