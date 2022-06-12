import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarGroup } from '@mui/material';
import classNames from 'classnames';

import useModal from 'src/hooks/useModal';
import { RootState } from 'src/reducers';
import { BFixedEvent } from 'src/types/fixedEvent';
import {
  dateToDailyTime,
  dateToMMdd,
  getDDay,
  getKorDay,
} from 'src/utils/dateParser';

import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';

interface Props {
  event: BFixedEvent;
  disabled?: boolean; // 클릭 방지
}

function FixedEventCard({ event }: Props) {
  const { openModal } = useModal();

  const curUserId = useSelector(
    (state: RootState) => state.mainFixed.curUserId
  );

  const {
    eventTimeStartsAt,
    eventPlace,
    participants,
    eventZoomAddress,
    eventHost: { userId: hostId },
    isDisabled,
  } = event;

  const handleOverviewClick = () => {
    openModal('Overview', { event });
  };

  const isHost = useMemo(() => curUserId === hostId, [curUserId, hostId]);

  const date = useMemo(() => new Date(eventTimeStartsAt), [event]);
  const MMdd = useMemo(() => dateToMMdd(date), [date]);
  const dailyTime = useMemo(() => dateToDailyTime(date), [date]);
  const dDay = useMemo(() => getDDay(date), [date]);

  const EventLocation = useCallback(() => {
    if (eventZoomAddress) {
      return (
        <div className={'fixed-event-card-place'}>
          <PCIcon />
          온라인
        </div>
      );
    }
    return (
      <div className={'fixed-event-card-place'}>
        <LocIcon />
        {eventPlace}
      </div>
    );
  }, [eventPlace, eventZoomAddress]);

  return (
    <button
      onClick={handleOverviewClick}
      className={classNames('fixed-event-card', {
        disabled: isDisabled,
      })}
    >
      <div className={'fixed-event-card-date'}>
        <span>{MMdd}</span> {getKorDay(date)}
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
    </button>
  );
}

export default FixedEventCard;
