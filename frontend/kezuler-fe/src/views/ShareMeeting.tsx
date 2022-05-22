import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { RootState } from 'src/reducers';

import BlackButton from 'src/components/common/BlackButton';

function ShareMeeting() {
  const { shareUrl } = useSelector((state: RootState) => state.createMeeting);

  // useEffect(()=>{}, [shareUrl]);

  const handleClick = () => {
    console.log('clicked!');
  };
  return (
    <>
      <h3>미팅이 생성되었습니다.</h3>
      <h3>케줄러 링크를 통해 사람들을 초대해주세요</h3>
      <div>
        <Button></Button>
        <Button></Button>
        <Button></Button>
      </div>
      <BlackButton onClick={handleClick} text="홈으로" />
    </>
  );
}

export default ShareMeeting;
