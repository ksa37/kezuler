import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreateCommentState {
  commentConent: string;
}

const initialState: CreateCommentState = {
  commentConent: '',
};

export const createCommentSlice = createSlice({
  name: 'create-meeting',
  initialState,
  reducers: {
    setCommentContent: (state, action: PayloadAction<string>) => {
      state.commentConent = action.payload;
    },
    destroy: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const createCommentActions = createCommentSlice.actions;

export default createCommentSlice.reducer;
