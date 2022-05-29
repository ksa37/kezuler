import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { RootState } from 'src/reducers';

import BotomButton from 'src/components/common/BottomButton';
import ProgressBar from 'src/components/ProgressBar';

function MeetingShare() {
  const { shareUrl } = useSelector((state: RootState) => state.createMeeting);

  // useEffect(()=>{}, [shareUrl]);

  const kakaoShareText = '카카오톡 공유';
  const linkShareText = '링크복사';
  const generalShareText = '공유하기';

  const handleClick = () => {
    console.log('clicked!');
  };

  const handleKakaoShareClick = () => {
    console.log('clicked!');
  };
  const handleLinkShareClick = () => {
    console.log('clicked!');
  };
  const handleGeneralShareClick = () => {
    console.log('clicked!');
  };

  return (
    <>
      <ProgressBar progress={100} />
      <h3>미팅이 생성되었습니다.</h3>
      <h3>케줄러 링크를 통해 사람들을 초대해주세요</h3>
      <div>
        <Button onClick={handleKakaoShareClick}>{kakaoShareText}</Button>
        <Button onClick={handleLinkShareClick}>{linkShareText}</Button>
        <Button onClick={handleGeneralShareClick}>{generalShareText}</Button>
      </div>
      <BotomButton onClick={handleClick} text="홈으로" />
    </>
  );
}

export default MeetingShare;
