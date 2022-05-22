import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { KAKAO_AUTH_URL } from '../constants/Oauth';
import { RootState } from '../reducers';
import { mockThunkAction } from '../reducers/AcceptMeeting';
import { AppDispatch } from '../store/store';

import BlackButton from '../components/BlackButton';
import CalendarView from '../components/CalendarView';
import ProgressBar from '../components/ProgressBar';

function Main() {
  const dispatch = useDispatch<AppDispatch>();

  const handleFetchClick = () => {
    dispatch(mockThunkAction(''));
  };

  return (
    <>
      <Button href={KAKAO_AUTH_URL}>
        {/* <img src={kakaologo}></img> */}
        <span>카카오계정 로그인</span>
      </Button>
      <Button onClick={handleFetchClick}></Button>
      <BlackButton onClick={() => console.log('hi')} text="다음" />
      {/* <CalendarView /> */}
      {/* <MeetingCard/> */}
      <ProgressBar />
    </>
  );
}

export default Main;
