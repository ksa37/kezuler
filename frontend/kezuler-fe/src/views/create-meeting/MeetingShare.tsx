import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import { RootState } from 'src/reducers';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as CelebrateIcon } from 'src/assets/celebrate_icon.svg';
import { ReactComponent as CelebrateSmileIcon } from 'src/assets/celebrate_smile_icon.svg';
import { ReactComponent as KakaoIcon } from 'src/assets/kakao_icon_big.svg';
import { ReactComponent as LinkIcon } from 'src/assets/link_icon_big.svg';
import { ReactComponent as ShareIcon } from 'src/assets/share_icon_big.svg';

declare global {
  interface Window {
    Kakao: any;
  }
}

function MeetingShare() {
  const { eventTitle, shareUrl, eventId } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const navigate = useNavigate();
  const { copyText } = useCopyText();

  const kakaoShareText = '카카오톡';
  const linkShareText = '링크복사';
  const generalShareText = '공유하기';

  useEffect(() => {
    if (window.Kakao) {
      // 중복 initialization 방지
      if (!window.Kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        window.Kakao.init('c84daff056f54704dedf2314c5411fdf');
      }
    }
  }, []);

  const handleHomeClick = () => {
    navigate(PathName.main);
  };

  const handleKakaoShareClick = () => {
    window.Kakao.Link.sendCustom({
      templateId: 77565,
      templateArgs: {
        HostName: getCurrentUserInfo()?.userName,
        MeetingName: eventTitle,
        ShareLink: `invite/${eventId}`,
        ModifyLink: `modify/${eventId}`,
      },
    });
  };
  const handleLinkShareClick = () => {
    copyText(`${shareUrl}`, '케줄러 링크가');
  };
  const handleGeneralShareClick = () => {
    if (typeof navigator.share !== 'undefined') {
      window.navigator.share({
        title: `${
          getCurrentUserInfo()?.userName
        }님이 ${eventTitle}에 초대합니다!`, // 공유될 제목
        text: '참여하기 버튼을 눌러 여러분이 참여 가능한 시각을 알려주세요!', // 공유될 설명
        url: shareUrl, // 공유될 URL
      });
    }
  };

  return (
    <div className={'padding-wrapper'}>
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
          // id="kakao-link-btn"
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
      <BottomButton onClick={handleHomeClick} text="홈으로 가기" />
    </div>
  );
}

export default MeetingShare;
