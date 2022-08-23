import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { FIXED_TODAY_ID } from 'src/constants/Main';
import PathName from 'src/constants/PathName';
import useMainFixed from 'src/hooks/useMainFixed';
import useMainPending from 'src/hooks/useMainPending';
import {
  getIntervalFromToday,
  getMonthFromTimeStamp,
} from 'src/utils/dateParser';
import getTimezoneDate from 'src/utils/getTimezoneDate';

import BottomPopper from '../../common/BottomPopper';
import MainButtonContainer from '../MainButtonContainer';
import FixedEventCard from './FixedEventCard';
import EmptyFixedEventCard from 'src/components/main-page/main-fixed-events/EmptyFixedEventCard';

import BottomCardBg from 'src/assets/img_bottom_popper_cards.svg';

function MainFixedEvents() {
  const { getFixedEvents, events, isFetched } = useMainFixed();

  const {
    events: pendingEvents,
    isFetched: isPendingFetched,
    getPendingEvents,
  } = useMainPending();

  useEffect(() => {
    getFixedEvents();
  }, []);

  // 화면 첫 진입 시 오늘로 스크롤 내림
  useEffect(() => {
    if (isFetched) {
      // console.log('fetched');
      const element = document.getElementById(FIXED_TODAY_ID);
      element?.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  }, [isFetched]);

  const [popupOpened, setPopupOpened] = useState(true);

  const handleClosePopper = () => {
    setPopupOpened(false);
  };

  useEffect(() => {
    getPendingEvents();
  }, [events.length === 0]);

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
          // <BottomPopper
          //   title={'단 하나의 링크로 미팅 확정까지!'}
          //   description={'시간 조율하느라 허비되는 시간 NO!'}
          //   buttonText={'첫 미팅 만들러가기'}
          //   onClick={handleCreateClick}
          //   // image={BottomCardBg}
          //   onDisableClick={handleClosePopper}
          //   reverseOrder
          // />
          <BottomPopper
            title={'케:줄러로 미팅 잡자!'}
            description={'시간 조율하느라 받는 스트레스 이제 그만!'}
            buttonText={'첫 미팅 만들러가기'}
            onClick={handleCreateClick}
            // image={BottomCardBg}
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
        <Outlet />
      </div>
      <MainButtonContainer />
    </>
  );
}

export default MainFixedEvents;
