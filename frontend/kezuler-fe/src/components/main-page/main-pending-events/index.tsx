import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { GOOGLE_LOGIN_SCOPE } from 'src/constants/Auth';
import useDialog from 'src/hooks/useDialog';
import useGetUserInfo from 'src/hooks/useGetUserInfo';
import useMainPending from 'src/hooks/useMainPending';
import { usePatchUser } from 'src/hooks/usePatchUser';
import { RootState } from 'src/reducers';
import { mainPendingActions } from 'src/reducers/mainPending';
import { AppDispatch } from 'src/store';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import BottomPopper from '../../common/BottomPopper';
import MainButtonContainer from '../MainButtonContainer';
import PendingEventCard from './PendingEventCard';

import BottomCalendarBg from 'src/assets/img_bottom_popper_calendar.svg';

import { getGoogleAccount } from 'src/api/calendar';

function MainPendingEvents() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, isFetched, getPendingEvents } = useMainPending();
  const { nextPage, isEnd } = useSelector(
    (state: RootState) => state.mainPending
  );
  const { destroy } = mainPendingActions;

  const { googleToggle } = useMemo(() => ({ ...getCurrentUserInfo() }), []);
  const { changeUser } = usePatchUser();
  const { getUserInfo } = useGetUserInfo();

  const [isCalendarPaired, setIsCalendarPaired] = useState(googleToggle);
  const [ref, inView] = useInView();
  const { openDialog } = useDialog();

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

  const checkIos = () => {
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
    } else {
      connectGoogle();
    }
  };

  const handleGooglelogin = () => {
    openDialog({
      title: `구글 캘린더 연동`,
      description:
        '확정된 일정을 자동으로 등록하고,\n 일정을 확인해 중복 예약을 \n 방지할 수 있습니다.',
      onConfirm: checkIos,
    });
  };

  // const obsRef = useRef(null);
  const page = useRef(0); //현재 페이지

  useEffect(() => {
    dispatch(destroy());
    if (page.current === 0) {
      getPendingEvents(page.current);
      page.current += 1;
    }
    return () => {
      dispatch(destroy());
    };
  }, []);

  const fetchCards = () => {
    if (page.current == nextPage && !isEnd) {
      getPendingEvents(page.current);
      page.current += 1;
    }
  };

  useEffect(() => {
    if (inView && !isEnd) {
      fetchCards();
    }
  }, [fetchCards, nextPage, isEnd, inView]);

  const [popupOpened, setPopupOpened] = useState(true);

  const handleConnectClick = () => {
    if (!googleToggle) {
      handleGooglelogin();
    }
  };

  const handleClosePopper = () => {
    setPopupOpened(false);
  };

  if (!isFetched) {
    return null;
  }

  if (!events.length) {
    return (
      <>
        <div className={'main-pending'}>
          <h2 className={'main-empty-h2'}>대기중인 미팅이 없습니다.</h2>
          {!isCalendarPaired && (
            <BottomPopper
              title={'케줄러 100% 활용하기'}
              description={'캘린더를 연동하여 이중약속을 방지해요!'}
              buttonText={'구글 계정 연동하기'}
              onClick={handleConnectClick}
              onDisableClick={handleClosePopper}
              image={BottomCalendarBg}
            />
          )}
        </div>
        {(!popupOpened || isCalendarPaired) && <MainButtonContainer />}
      </>
    );
  }

  return (
    <>
      <div className={'main-pending'}>
        {events ? (
          events.map((e) => <PendingEventCard key={e.eventId} event={e} />)
        ) : (
          <h2 className={'main-empty-h2'}>대기중인 미팅이 없습니다.</h2>
        )}
        <div ref={ref}></div>
        <Outlet />
      </div>
      <MainButtonContainer />
    </>
  );
}

export default MainPendingEvents;
