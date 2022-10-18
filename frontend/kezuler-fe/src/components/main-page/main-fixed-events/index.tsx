import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { FIXED_TODAY_ID } from 'src/constants/Main';
import PathName from 'src/constants/PathName';
import useMainFixed from 'src/hooks/useMainFixed';
import useMainPending from 'src/hooks/useMainPending';
import { RootState } from 'src/reducers';
import { mainFixedActions } from 'src/reducers/mainFixed';
import { mainPendingActions } from 'src/reducers/mainPending';
import { AppDispatch } from 'src/store';
import {
  getIntervalFromToday,
  getMonthFromTimeStamp,
} from 'src/utils/dateParser';
import getTimezoneDate from 'src/utils/getTimezoneDate';

import BottomPopper from '../../common/BottomPopper';
import MainButtonContainer from '../MainButtonContainer';
import FixedEventCard from './FixedEventCard';
import EmptyFixedEventCard from 'src/components/main-page/main-fixed-events/EmptyFixedEventCard';

function MainFixedEvents() {
  const dispatch = useDispatch<AppDispatch>();
  const { getFixedEvents, events, isFetched } = useMainFixed();
  const { destroy: pendingDestroy } = mainPendingActions;
  const { destroy: fixedDestroy } = mainFixedActions;

  const { nextPage, isBtmEnd, prePage, isTopEnd } = useSelector(
    (state: RootState) => state.mainFixed
  );

  const [refTop, inViewTop] = useInView();
  const [refBtm, inViewBtm] = useInView();

  const {
    events: pendingEvents,
    isFetched: isPendingFetched,
    getPendingEvents,
  } = useMainPending();

  const pageBtm = useRef(0);
  const pageTop = useRef(0);

  useEffect(() => {
    dispatch(fixedDestroy());
    if (pageBtm.current === 0) {
      getFixedEvents(pageBtm.current);
      pageBtm.current += 1;
      pageTop.current -= 1;
    }

    return () => {
      dispatch(pendingDestroy());
      dispatch(fixedDestroy());
    };
  }, []);

  useEffect(() => {
    if (events.length === 0) {
      getPendingEvents(0);
    }
  }, [events.length === 0]);

  const fetchBtmCards = () => {
    // console.log(pageBtm.current, nextPage, !isBtmEnd);
    if (pageBtm.current == nextPage && !isBtmEnd) {
      getFixedEvents(pageBtm.current);
      pageBtm.current += 1;
    }
  };

  const fetchTopCards = () => {
    if (pageTop.current == prePage && !isTopEnd) {
      getFixedEvents(pageTop.current);
      pageTop.current -= 1;
    }
  };

  useEffect(() => {
    console.log(
      'Reached Bottom',
      pageBtm.current,
      nextPage,
      isBtmEnd,
      inViewBtm
    );
    if (inViewBtm && !isBtmEnd) {
      fetchBtmCards();
    }
  }, [fetchBtmCards, nextPage, isBtmEnd, inViewBtm]);

  useEffect(() => {
    console.log('Reached Top', pageTop.current, prePage, isTopEnd, inViewTop);
    if (inViewTop && !isTopEnd) {
      console.log('hello top called');
      fetchTopCards();
    }
  }, [fetchTopCards, prePage, isTopEnd, inViewTop]);
  // 화면 첫 진입 시 오늘로 스크롤 내림
  useEffect(() => {
    if (isFetched) {
      const element = document.getElementById(FIXED_TODAY_ID);
      element?.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  }, [isFetched]);

  const [popupOpened, setPopupOpened] = useState(true);

  const handleClosePopper = () => {
    setPopupOpened(false);
  };

  const isPendingExist = useMemo(() => {
    if (isPendingFetched) return pendingEvents.length > 0;
    else false;
  }, [isPendingFetched]);

  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate(PathName.create);
  };

  // 오늘 버튼의 기준이 될 event id 를 찾는 useMemo
  // 오늘에 해당하는 이벤트 있으면 해당하는 이벤트 중 맨 앞
  // 없다면 제일 가까운 다가오는 이벤트
  // 다가오는 이벤트가 없다면 제일 가까운 지나간 이벤트
  const todayIdTargetIdx = useMemo(() => {
    let target = -1;
    for (let i = events.length - 1; i >= 0; i--) {
      const date = getTimezoneDate(
        new Date(events[i].eventTimeStartsAt).getTime()
      );
      const interval = getIntervalFromToday(date);
      if (interval > 0) {
        if (target === -1) {
          target = i;
        }
        break;
      }
      target = i;
    }
    return target;
  }, [events]);

  if (!isFetched) {
    return null;
  }

  if (!events.length) {
    return (
      <div id={FIXED_TODAY_ID} className={'main-fixed-empty'}>
        <div className={'main-fixed-empty'}>
          <h1 className={'main-fixed-month-divider'}>
            {getMonthFromTimeStamp()}월
          </h1>
          <EmptyFixedEventCard />
        </div>
        {popupOpened && !isPendingExist && (
          <BottomPopper
            title={'케:줄러로 미팅 잡자!'}
            description={'시간 조율하느라 받는 스트레스 이제 그만!'}
            buttonText={'첫 미팅 만들러가기'}
            onClick={handleCreateClick}
            onDisableClick={handleClosePopper}
            reverseOrder
          />
        )}
        {(isPendingExist || !popupOpened) && <MainButtonContainer />}
      </div>
    );
  }

  return (
    <>
      <div className={'main-fixed'}>
        <div ref={refTop}></div>
        {events.map((e, i) => {
          const curMonth = getMonthFromTimeStamp(e.eventTimeStartsAt);
          return (
            <React.Fragment key={e.eventId}>
              {(i === 0 ||
                (i >= 1 &&
                  getMonthFromTimeStamp(events[i - 1].eventTimeStartsAt) !==
                    curMonth)) && (
                <h1 className={'main-fixed-month-divider'}>{curMonth}월</h1>
              )}
              <FixedEventCard
                key={e.eventId}
                event={e}
                hasTodayId={i === todayIdTargetIdx}
              />
            </React.Fragment>
          );
        })}
        <div ref={refBtm}></div>
        <Outlet />
      </div>
      <MainButtonContainer />
    </>
  );
}

export default MainFixedEvents;
