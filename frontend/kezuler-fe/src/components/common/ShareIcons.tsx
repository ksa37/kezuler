import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Stack } from '@mui/material';
import classNames from 'classnames';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import { ReactComponent as KakaoIcon } from 'src/assets/kakao_icon_big.svg';
import { ReactComponent as LinkIcon } from 'src/assets/link_icon_big.svg';
import { ReactComponent as ShareIcon } from 'src/assets/share_icon_big.svg';
import 'src/styles/components.scss';

interface Props {
  eventTitle: string;
  eventId: string;
  forPopup?: boolean;
}

declare global {
  interface Window {
    Kakao: any;
  }
}

function ShareIcons({ eventTitle, eventId, forPopup }: Props) {
  const kakaoShareText = '카카오톡';
  const linkShareText = '링크복사';
  const generalShareText = '공유하기';
  const dispatch = useDispatch<AppDispatch>();
  const { copyText } = useCopyText();
  const { show: showAlert } = alertAction;

  const shareUrl = `${CURRENT_HOST}${PathName.invite}/${eventId}/invitation`;

  useEffect(() => {
    if (window.Kakao) {
      // 중복 initialization 방지
      if (!window.Kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        window.Kakao.init('c84daff056f54704dedf2314c5411fdf');
      }
    }
  }, []);

  const handleKakaoShareClick = () => {
    window.Kakao.Link.sendCustom({
      templateId: 77565,
      templateArgs: {
        HostName: getCurrentUserInfo()?.userName,
        MeetingName: eventTitle,
        ShareLink: `invite/${eventId}/invitation`,
        ModifyLink: `modify/${eventId}`,
      },
    });
  };
  const handleLinkShareClick = () => {
    copyText(`${shareUrl}`, '케줄러링크가');
  };
  const handleGeneralShareClick = () => {
    console.log(typeof navigator.share);
    if (typeof navigator.share !== 'undefined') {
      window.navigator.share({
        title: `${
          getCurrentUserInfo()?.userName
        }님이 ${eventTitle}에 초대합니다!`, // 공유될 제목
        text: '케줄러링크를 눌러 여러분이 참여 가능한 시각을 알려주세요!', // 공유될 설명
        url: shareUrl, // 공유될 URL
      });
    } else {
      dispatch(
        showAlert({
          title: '공유하기 오류',
          description: '공유하기가 지원이 안되는 환경입니다.',
        })
      );
    }
  };

  return (
    <Stack
      direction="row"
      spacing={'16px'}
      className={classNames('share-icons', { 'for-popup': forPopup })}
    >
      <button
        className={classNames('share-icon', 'kakao', { 'for-popup': forPopup })}
        onClick={handleKakaoShareClick}
      >
        <KakaoIcon />
        <div className={'share-text'}>{kakaoShareText}</div>
      </button>
      <button
        className={classNames('share-icon', { 'for-popup': forPopup })}
        onClick={handleLinkShareClick}
      >
        <LinkIcon />
        <div className={'share-text'}>{linkShareText}</div>
      </button>
      {typeof navigator.share !== 'undefined' && (
        <button
          className={classNames('share-icon', { 'for-popup': forPopup })}
          onClick={handleGeneralShareClick}
        >
          <ShareIcon />
          <div className={'share-text'}>{generalShareText}</div>
        </button>
      )}
    </Stack>
  );
}

export default ShareIcons;
