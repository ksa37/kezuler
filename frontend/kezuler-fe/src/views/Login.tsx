import React from 'react';
import { Button } from '@mui/material';

import { KAKAO_AUTH_URL } from '../constants/Oauth';

import BlackButton from '../components/BlackButton';
import CalendarView from '../components/CalendarView';
import MeetingCard from '../components/MeetingCard';
import ProgressBar from '../components/ProgressBar';

function Login() {
  return (
    <>
      <Button href={KAKAO_AUTH_URL}>
        {/* <img src={kakaologo}></img> */}
        <span>카카오계정 로그인</span>
      </Button>
      <BlackButton onClick={() => console.log('hi')} text="다음" />
      <CalendarView />
      {/* <MeetingCard/> */}
      <ProgressBar />
    </>
  );
}

export default Login;
