import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';

import { KAKAO_AUTH_URL } from 'src/constants/Oauth';
import { mockThunkAction } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import BottomButton from 'src/components/common/BottomButton';

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
      <BottomButton onClick={() => console.log('hi')} text="다음" />
      {/* <CalendarView /> */}
      {/* <MeetingCard/> */}
    </>
  );
}

export default Main;
