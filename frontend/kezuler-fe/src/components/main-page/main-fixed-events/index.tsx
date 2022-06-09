import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/reducers';
import { getFixedEventsThunk } from 'src/reducers/mainFixed';
import { AppDispatch } from 'src/store';
import { getMonthFromDateString } from 'src/utils/dateParser';

import BottomPopper from '../../common/BottomPopper';
import FixedEventCard from './FixedEventCard';
import EmptyFixedEventCard from 'src/components/main-page/main-fixed-events/EmptyFixedEventCard';
import MainButtonContainer from 'src/components/main-page/MainButtonContainer';

const useMainFixed = () => {
  const { events } = useSelector((state: RootState) => state.mainFixed);
  const dispatch = useDispatch<AppDispatch>();

  const getFixedEvents = useCallback(() => {
    return dispatch(getFixedEventsThunk({ startIndex: 0, endIndex: 10 }));
  }, [dispatch]);

  return { getFixedEvents, events };
};

function MainFixedEvents() {
  const { getFixedEvents, events } = useMainFixed();

  useEffect(() => {
    getFixedEvents();
  }, []);

  const handleCreateClick = () => {
    console.log('create');
  };

  const isEvent = false;
  if (!isEvent) {
    return (
      <div className={'main-fixed'}>
        <h1 className={'main-fixed-month-divider'}>
          {getMonthFromDateString()}월
        </h1>
        <EmptyFixedEventCard />
        <h2 className={'main-empty-h2'}>
          {'다가오는 미팅이 없습니다.\n혹시 잊으신 일정은 없나요?'}
        </h2>
        <MainButtonContainer />
        <BottomPopper
          title={'미팅 생성까지 단 3분!'}
          buttonText={'첫 미팅 만들러가기'}
          onClick={handleCreateClick}
          image={''}
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
            <FixedEventCard key={e.eventId} event={e} />
          </React.Fragment>
        );
      })}
      <MainButtonContainer />
    </div>
  );
}

export default MainFixedEvents;
