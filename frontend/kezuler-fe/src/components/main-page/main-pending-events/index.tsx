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

  const handleGooglelogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    flow: 'auth-code',
    scope: GOOGLE_LOGIN_SCOPE,
  });

  // const obsRef = useRef(null);
  const page = useRef(0); //현재 페이지

  useEffect(() => {
    dispatch(destroy());
    if (page.current === 0) {
      getPendingEvents(page.current);
      page.current += 1;
    }
    if (inView && !isEnd) {
      fetchCards();
    }
    return () => {
      dispatch(destroy());
    };
  }, []);

  const fetchCards = useCallback(async () => {
    if (page.current == nextPage && !isEnd) {
      getPendingEvents(page.current);
      page.current += 1;
    }
  }, []);

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
