import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { GOOGLE_LOGIN_SCOPE } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import useDialog from 'src/hooks/useDialog';
import useGetUserInfo from 'src/hooks/useGetUserInfo';
import { usePatchUser } from 'src/hooks/usePatchUser';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import BottomButton from 'src/components/common/BottomButton';
import BottomPopper from 'src/components/common/BottomPopper';

import CelebrateIcon from 'src/assets/image/celebrate.png';
import CelebrateSmileIcon from 'src/assets/image/celebrate-emoji.png';
import BottomCalendarBg from 'src/assets/img_bottom_popper_calendar.svg';

import { getGoogleAccount } from 'src/api/calendar';
interface Props {
  boldTextFirst: string;
  boldTextSecond: string;
  regularTextFirst: string;
  regularTextSecond: string;
}

function CompletionPage({
  boldTextFirst,
  boldTextSecond,
  regularTextFirst,
  regularTextSecond,
}: Props) {
  const navigate = useNavigate();
  const { googleToggle } = useMemo(() => ({ ...getCurrentUserInfo() }), []);
  const { changeUser } = usePatchUser();
  const { getUserInfo } = useGetUserInfo();
  const { openDialog } = useDialog();

  const [isCalendarPaired, setIsCalendarPaired] = useState(googleToggle);

  const handleGoogleSuccess = (res: any) => {
    changeUser(
      getGoogleAccount(res.code),
      {
        onSuccess: () => {
          getUserInfo();
          setIsCalendarPaired(!isCalendarPaired);
        },
      },
      true
    );
  };

  const connectGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    flow: 'auth-code',
    scope: GOOGLE_LOGIN_SCOPE,
  });

  const checkIosNaver = () => {
    const Agent = navigator.userAgent;

    const checkIosPage = () => {
      const mobile = document.createElement('meta');
      mobile.name = 'viewport';
      mobile.content =
        'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, minimal-ui';
      document.getElementsByTagName('head')[0].appendChild(mobile);
      document.body.innerHTML =
        "<style>body{margin:0;padding:0;overflow: hidden;height: 100%;}</style><h2 style='padding-top:50px; text-align:center;'>인앱브라우저 호환문제로 인해<br />Safari로 접속해야합니다.</h2><article style='text-align:center; font-size:17px; word-break:keep-all;color:#999;'>아래 버튼을 눌러 Safari를 실행해주세요<br />Safari가 열리면, 주소창을 길게 터치한 뒤,<br />'붙여놓기 및 이동'을 누르면<br />정상적으로 이용할 수 있습니다.<br /><br /><button onclick='inappbrowserout();' style='min-width:180px;margin-top:10px;height:54px;font-weight: 700;background-color:#fad94f;color:#000;border-radius: 4px;font-size:17px;border:0;'>Safari로 열기</button></article><img style='width:70%;margin:50px 15% 0 15%' src='https://tistory3.daumcdn.net/tistory/1893869/skin/images/inappbrowserout.jpeg' />";
    };

    if (Agent.match(/iPhone|iPad/i)) {
      if (Agent.toLowerCase().includes('kakao')) {
        checkIosPage();
      } else if (Agent.toLowerCase().includes('naver')) {
        checkIosPage();
      } else if (Agent.includes('instagram')) {
        checkIosPage();
      } else {
        connectGoogle();
      }
    } else if (Agent.toLowerCase().includes('naver')) {
      navigate(PathName.InAppNoti);
    } else {
      connectGoogle();
    }
  };

  const handleGooglelogin = () => {
    openDialog({
      title: `구글 캘린더 연동`,
      description:
        '확정된 일정을 자동으로 등록하고,\n 일정을 확인해 중복 예약을 \n 방지할 수 있습니다.',
      onConfirm: checkIosNaver,
    });
  };

  const handleConnectClick = () => {
    if (!googleToggle) {
      handleGooglelogin();
    }
  };

  const handleHomeClick = () => {
    navigate(PathName.mainFixed);
  };

  const [popupOpened, setPopupOpened] = useState(true);

  const handleClosePopper = () => {
    setPopupOpened(false);
  };

  return (
    <div className={'acceptance-completion'}>
      <div className={'accept-description-text'}>
        {boldTextFirst}
        <br />
        {boldTextSecond}
      </div>
      <div className={'acceptance-completion-sub-description'}>
        {regularTextFirst}
        <br />
        {regularTextSecond}
      </div>
      <div className={'acceptance-completion-bottom-area'}>
        {!isCalendarPaired && (
          <BottomPopper
            title={'케줄러 100% 활용하기'}
            description={'캘린더를 연동하여 이중약속을 방지해요!'}
            buttonText={'구글 계정 연동하기'}
            onClick={handleConnectClick}
            onDisableClick={handleClosePopper}
            image={BottomCalendarBg}
            notFixed
          />
        )}
        <BottomButton onClick={handleHomeClick} text={'홈으로 가기'} notFixed />
      </div>
      {(!popupOpened || isCalendarPaired) && (
        <>
          <img
            src={CelebrateSmileIcon}
            className={'celebrate-smile-icon-confirm'}
            alt={''}
          />
          <img
            src={CelebrateIcon}
            className={'celebrate-icon-confirm'}
            alt={''}
          />
        </>
      )}
    </div>
  );
}

export default CompletionPage;
