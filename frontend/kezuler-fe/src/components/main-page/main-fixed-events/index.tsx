import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { RootState } from 'src/reducers';
import { getFixedEventsThunk } from 'src/reducers/mainFixed';
import { AppDispatch } from 'src/store';
import { getMonthFromDateString } from 'src/utils/dateParser';

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

  if (!events) {
    return (
      <div>
        <EmptyFixedEventCard />
        <div>
          <div>
            <h1>미팅 생성까지 단 3분!</h1>
            <Button>첫 미팅 만들러가기</Button>
          </div>
          {/*<FixedEventCard event={} disabled />*/}
          {/*<FixedEventCard event={} disabled />*/}
          <MainButtonContainer />
        </div>
      </div>
    );
  }
  return (
    <div>
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
    </div>
  );
}

export default MainFixedEvents;
