import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarGroup } from '@mui/material';

import { RootState } from 'src/reducers';
import { BFixedEvent } from 'src/types/fixedEvent';
import { dateToDailyTime, dateToMMdd, getDDay } from 'src/utils/dateParser';

interface Props {
  event: BFixedEvent;
  disabled?: boolean; // 클릭 방지
}

function FixedEventCard({ event }: Props) {
  const curUserId = useSelector(
    (state: RootState) => state.mainFixed.curUserId
  );

  const {
    eventTimeStartsAt,
    eventPlace,
    participants,
    eventZoomAddress,
    eventHostId,
  } = event;

  const isHost = useMemo(
    () => curUserId === eventHostId,
    [curUserId, eventHostId]
  );

  const date = useMemo(() => new Date(eventTimeStartsAt), [event]);
  const MMdd = useMemo(() => dateToMMdd(date), [date]);
  const dailyTime = useMemo(() => dateToDailyTime(date), [date]);
  const dDay = useMemo(() => getDDay(date), [date]);

  const EventLocation = useCallback(() => {
    if (eventZoomAddress) {
      return <div>줌(zoom)</div>;
    }
    return (
      <div>
        <span>아이콘</span>
        {eventPlace}
      </div>
    );
  }, [eventPlace, eventZoomAddress]);

  return (
    <section className={'fixed-event-card'}>
      <div className={'fixed-event-card-date'}>
        <span>{MMdd}</span>월
      </div>
      <div className={'fixed-event-card-info'}>
        <div>
          <span className={'fixed-event-card-time'}>{dailyTime}</span>
          {dDay}
        </div>
        <div>{event.eventTitle}</div>
        <div>
          <AvatarGroup max={4}>
            {participants.map((p) => (
              <Avatar key={p.userId} alt={p.userId} src={p.userProfileImage} />
            ))}
          </AvatarGroup>
          <EventLocation />
        </div>
      </div>
    </section>
  );
}

export default FixedEventCard;
