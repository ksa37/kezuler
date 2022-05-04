import axios from 'axios';
import PathName from '../constants/PathName';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SERVER_URI } from '../constants/Oauth';

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

//https://data-jj.tistory.com/53
//dispatch, getState, { history }도 원래 들어가있음
export function kakaoLogin(code: any) {
  return function ({ history }: any) {
    axios({
      method: 'GET',
      url: `http://${SERVER_URI}/oauth/callback/kakao?code=${code}`,
    })
      .then((res) => {
        console.log(res); // 토큰이 넘어올 것임

        const ACCESS_TOKEN = res.data.accessToken;

        localStorage.setItem('token', ACCESS_TOKEN); //예시로 로컬에 저장함

        history.replace(PathName.main); // 토큰 받았았고 로그인됐으니 화면 전환시켜줌(메인으로)
      })
      .catch((err) => {
        console.log('소셜로그인 에러', err);
        window.alert('로그인에 실패하였습니다.');
        history.replace(PathName.login); // 로그인 실패하면 로그인화면으로 돌려보냄
      });
  };
}
