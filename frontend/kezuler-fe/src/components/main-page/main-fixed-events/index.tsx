import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { FIXED_TODAY_ID } from 'src/constants/Main';
import PathName from 'src/constants/PathName';
import { RootState } from 'src/reducers';
import { getFixedEventsThunk } from 'src/reducers/mainFixed';
import { AppDispatch } from 'src/store';
import {
  getIntervalFromToday,
  getMonthFromDateString,
} from 'src/utils/dateParser';

import BottomPopper from '../../common/BottomPopper';
import FixedEventCard from './FixedEventCard';
import EmptyFixedEventCard from 'src/components/main-page/main-fixed-events/EmptyFixedEventCard';
import MainButtonContainer from 'src/components/main-page/MainButtonContainer';

const useMainFixed = () => {
  const { events, isFetched } = useSelector(
    (state: RootState) => state.mainFixed
  );
  const dispatch = useDispatch<AppDispatch>();

  const getFixedEvents = useCallback(() => {
    //TODO index 설정
    return dispatch(getFixedEventsThunk({ startIndex: '0', endIndex: '10' }));
  }, [dispatch]);

  return { getFixedEvents, events, isFetched };
};

function MainFixedEvents() {
  const { getFixedEvents, events, isFetched } = useMainFixed();

  useEffect(() => {
    getFixedEvents();
  }, []);

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
    if (events) {
      for (let i = events.length - 1; i >= 0; i--) {
        const date = new Date(events[i].eventTimeStartsAt);
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
    }
  }, [events]);

  if (!isFetched) {
    return null;
  }
  console.log(events);
  if (!events) {
    return (
      <div id={FIXED_TODAY_ID} className={'main-fixed'}>
        <h1 className={'main-fixed-month-divider'}>
          {getMonthFromDateString()}월
        </h1>
        <EmptyFixedEventCard />
        <h2 className={'main-empty-h2'}>
          {'다가오는 미팅이 없습니다.\n혹시 잊으신 일정은 없나요?'}
        </h2>
        <MainButtonContainer />
        <BottomPopper
          title={'단 하나의 링크로 미팅 확정까지!'}
          description={'시간 조율하느라 허비되는 시간 NO!'}
          buttonText={'첫 미팅 만들러가기'}
          onClick={handleCreateClick}
          image={''}
          reverseOrder
        />
      </div>
    );
  }

  return (
    <div className={'main-fixed'}>
      {events.map((e, i) => {
        const curMonth = getMonthFromDateString(e.eventTimeStartsAt);
        return (
          <React.Fragment key={e.eventId}>
            {(i === 0 ||
              (i > 1 &&
                getMonthFromDateString(events[i - 1].eventTimeStartsAt) !==
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
      <MainButtonContainer />
    </div>
  );
}

export default MainFixedEvents;
