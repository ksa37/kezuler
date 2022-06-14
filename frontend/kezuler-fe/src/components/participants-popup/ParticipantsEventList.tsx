import React, { useMemo } from 'react';
import { Avatar } from '@mui/material';
import classNames from 'classnames';

import { EventTimeCandidate } from 'src/types/pendingEvent';
import {
  getTimeListDivideByDateWithPossibleUsers,
  getTimeRange,
} from 'src/utils/dateParser';

import { ReactComponent as ProfileIcon } from 'src/assets/icon_profile.svg';

interface Props {
  candidates: EventTimeCandidate[];
  eventDuration: number;
}

// TODO
function ParticipantsEventList({ candidates, eventDuration }: Props) {
  const dateWithPossibleUsers = useMemo(
    () => getTimeListDivideByDateWithPossibleUsers(candidates),
    [candidates]
  );

  return (
    <div className={'participants-popup-timeline-list'}>
      <div className={'participants-popup-timeline-line'} />
      {Object.entries(dateWithPossibleUsers).map(([date, value]) => (
        <div className={'participants-popup-dateblock'} key={date}>
          <div className={'participants-popup-date'}>
            <div className={'participants-popup-timeline-circle'} />
            <b>{date}</b>
          </div>
          {value.map(({ eventStartsAt, possibleUsers }) => (
            <div
              className={'participants-popup-timeblock'}
              key={eventStartsAt.getTime()}
            >
              <div className={'participants-popup-time'}>
                <div className={'participants-popup-time-range'}>
                  {getTimeRange(eventStartsAt, eventDuration)}
                </div>
                <div className={'participants-popup-time-num'}>
                  <ProfileIcon className={'profile-icon'} />
                  {possibleUsers.length}
                </div>
              </div>
              <div
                className={classNames('participants-popup-list', 'timeline')}
              >
                {possibleUsers.map(({ userId, userName, userProfileImage }) => (
                  <div
                    className={'participants-popup-participant'}
                    key={userId}
                  >
                    <Avatar
                      className={'participant-avatar'}
                      src={userProfileImage}
                      alt={userName}
                    />
                    {userName}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ParticipantsEventList;
