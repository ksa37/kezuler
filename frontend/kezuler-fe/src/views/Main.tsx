import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { KAKAO_AUTH_URL } from 'src/constants/Oauth';
import { RootState } from 'src/reducers';
import { mockThunkAction } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import CalendarView from 'src/components/CalendarView';
import BlackButton from 'src/components/common/BlackButton';
import ProgressBar from 'src/components/ProgressBar';

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
