import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/reducers';
import { getPendingEventsThunk } from 'src/reducers/mainPending';
import { AppDispatch } from 'src/store';

import PendingEventCard from './PendingEventCard';
import MainButtonContainer from 'src/components/main-page/MainButtonContainer';

const useMainPending = () => {
  const { events } = useSelector((state: RootState) => state.mainPending);
  const dispatch = useDispatch<AppDispatch>();

  const getPendingEvents = useCallback(
    () => dispatch(getPendingEventsThunk({})),
    [dispatch]
  );

  return { getPendingEvents, events };
};

function MainPendingEvents() {
  const { events, getPendingEvents } = useMainPending();

  useEffect(() => {
    getPendingEvents();
  }, []);

  return (
    <div>
      {events.map((e) => (
        <PendingEventCard key={e.eventId} event={e} />
      ))}
      <MainButtonContainer />
    </div>
  );
}

export default MainPendingEvents;
