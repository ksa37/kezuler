import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { RootState } from 'src/reducers';

import BottomButton from 'src/components/common/BottomButton';

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
    <div>
      <div className={'description-text'}>
        {'새로운 미팅 일정이'}
        <br />
        {'완성되었습니다!'}
      </div>
      <div className={'sub-description-text'}>
        {'케줄러 링크를 통해'}
        <br />
        {'사람들을 미팅에 초대하세요!'}
      </div>
      <div>
        <Button onClick={handleKakaoShareClick}>{kakaoShareText}</Button>
        <Button onClick={handleLinkShareClick}>{linkShareText}</Button>
        <Button onClick={handleGeneralShareClick}>{generalShareText}</Button>
      </div>
      <BottomButton onClick={handleClick} text="홈으로 가기" />
    </div>
  );
}

export default MeetingShare;
