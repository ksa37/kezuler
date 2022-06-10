import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';
import { RootState } from 'src/reducers';

import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as Circle } from 'src/assets/acceptance_complete_circle.svg';
import { ReactComponent as CelebrateIcon } from 'src/assets/celebrate_icon.svg';
import { ReactComponent as CelebrateSmileIcon } from 'src/assets/celebrate_smile_icon.svg';
import { ReactComponent as KakaoIcon } from 'src/assets/kakao_icon_big.svg';
import { ReactComponent as LinkIcon } from 'src/assets/link_icon_big.svg';
import { ReactComponent as ShareIcon } from 'src/assets/share_icon_big.svg';

function MeetingShare() {
  const { shareUrl } = useSelector((state: RootState) => state.createMeeting);

  const navigate = useNavigate();

  const kakaoShareText = '카카오톡';
  const linkShareText = '링크복사';
  const generalShareText = '공유하기';

  const handleHomeClick = () => {
    navigate(PathName.main, { replace: true });
  };

  const handleKakaoShareClick = () => {
    location.href = shareUrl;
    console.log('clicked!');
  };
  const handleLinkShareClick = () => {
    location.href = shareUrl;
    console.log('clicked!');
  };
  const handleGeneralShareClick = () => {
    location.href = shareUrl;
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
      <Stack
        direction="row"
        spacing={'16px'}
        sx={{ marginBlock: '48px', display: 'block' }}
      >
        <Button
          className={classNames('share-icon', 'kakao')}
          sx={{
            color: '#282F39',
          }}
          onClick={handleKakaoShareClick}
        >
          <KakaoIcon />
          <div className={'share-text'}>{kakaoShareText}</div>
        </Button>
        <Button
          className={'share-icon'}
          sx={{
            color: '#282F39',
          }}
          onClick={handleLinkShareClick}
        >
          <LinkIcon />
          <div className={'share-text'}>{linkShareText}</div>
        </Button>
        <Button
          className={'share-icon'}
          sx={{ color: '#282F39' }}
          onClick={handleGeneralShareClick}
        >
          <ShareIcon />
          <div className={'share-text'}>{generalShareText}</div>
        </Button>
      </Stack>
      <CelebrateSmileIcon className={'celebrate-smile-icon'} />
      <CelebrateIcon className={'celebrate-icon'} />
      <Circle className={'completion-circle'} />
      <BottomButton onClick={handleHomeClick} text="홈으로 가기" />
    </div>
  );
}

export default MeetingShare;
