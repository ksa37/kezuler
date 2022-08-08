import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import classNames from 'classnames';

import { FIXED_TODAY_ID } from 'src/constants/Main';
import { makeFixedInfoUrl } from 'src/constants/PathName';
import { BFixedEvent } from 'src/types/fixedEvent';
import {
  dateToDailyTime,
  dateToMMdd,
  getDDay,
  getKorDay,
  isSameDate,
} from 'src/utils/dateParser';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import getTimezoneDate from 'src/utils/getTimezoneDate';

import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';

interface Props {
  event: BFixedEvent;
  hasTodayId: boolean;
}

function FixedEventCard({ event, hasTodayId }: Props) {
  const navigate = useNavigate();

  const {
    eventId,
    eventTimeStartsAt,
    eventPlace,
    // participants,
    eventZoomAddress,
    eventHost: { userId: hostId },
    isDisabled: isCanceled,
  } = event;

  const { participants } = event;
  // participants = [
  //   {
  //     userId: 'user0003',
  //     userName: 'svsvvds태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Accepted',
  //   },
  // ];
  const date = useMemo(
    () => getTimezoneDate(new Date(eventTimeStartsAt).getTime()),
    [event]
  );

  const isHost = useMemo(
    () => hostId === getCurrentUserInfo()?.userId,
    [hostId]
  );

  // today: 현재와 오늘 자정 사이
  const tense: 'today' | 'past' | 'future' = useMemo(() => {
    const now = getTimezoneDate(new Date().getTime());
    if (now.getTime() > date.getTime()) {
      return 'past';
    }
    if (isSameDate(now, date)) {
      return 'today';
    }
    return 'future';
  }, [hostId]);

  const handleOverviewClick = () => {
    navigate(makeFixedInfoUrl(eventId));
  };

  const MMdd = useMemo(() => dateToMMdd(date), [date]);
  const dailyTime = useMemo(() => dateToDailyTime(date), [date]);
  const dDay = useMemo(() => {
    if (isCanceled) {
      return '취소된 미팅';
    }
    switch (tense) {
      case 'past':
        return '지나간 미팅';
      case 'today':
        return 'Today';
      default:
        return getDDay(date);
    }
  }, [date]);

  const EventLocation = useCallback(() => {
    if (eventPlace) {
      return (
        <div className={'fixed-event-card-place'}>
          <LocIcon />
          <span>{eventPlace}</span>
        </div>
      );
    }
    return (
      <div className={'fixed-event-card-place'}>
        <PCIcon />
        <span>온라인</span>
      </div>
    );
  }, [eventPlace, eventZoomAddress]);

  const [windowSize, setWindowSize] = useState(getWindowSize());

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <button
      id={hasTodayId ? FIXED_TODAY_ID : undefined}
      onClick={handleOverviewClick}
      className={classNames('fixed-event-card', {
        canceled: isCanceled,
        'is-host': isHost,
        passed: tense === 'past',
        today: tense === 'today',
      })}
    >
      <div className={'fixed-event-card-date'}>
        <span>{MMdd}</span> {getKorDay(date)}
      </div>
      <div
        className={classNames('fixed-event-card-info', {
          'is-canceled': isCanceled,
        })}
      >
        <div>
          <span
            className={classNames('fixed-event-card-time', {
              'is-passed': tense === 'past',
            })}
          >
            {dailyTime}
          </span>
          {dDay}
        </div>
        <div>{event.eventTitle}</div>
        {!isCanceled && (
          <div>
            <AvatarGroup
              max={
                windowSize.innerWidth > 350
                  ? 4
                  : windowSize.innerWidth > 320
                  ? 3
                  : 2
              }
              classes={{ avatar: 'fixed-event-card-avatar-num' }}
            >
              {participants?.map(
                (p) =>
                  p.userStatus === 'Accepted' && (
                    <Avatar
                      className={'fixed-event-card-avatar'}
                      key={p.userId}
                      alt={p.userName}
                      src={p.userProfileImage}
                    />
                  )
              )}
            </AvatarGroup>
            <EventLocation />
          </div>
        )}
      </div>
    </button>
  );
}

export default FixedEventCard;
