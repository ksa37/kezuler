import React, { useMemo } from 'react';
import { Avatar } from '@mui/material';

import { EventTimeCandidate } from 'src/types/pendingEvent';
import {
  getTimeListDivideByDateWithPossibleUsers,
  getTimeRange,
} from 'src/utils/dateParser';

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
    <div className={'participants-popup-list'}>
      {Object.entries(dateWithPossibleUsers).map(([date, value]) => (
        <div key={date}>
          <div>{date}</div>
          {value.map(({ eventStartsAt, possibleUsers }) => (
            <div key={eventStartsAt.getTime()}>
              <div>
                {getTimeRange(eventStartsAt, eventDuration)}
                <div>
                  {'Icon'}
                  {possibleUsers.length}
                </div>
              </div>
              <div>
                {possibleUsers.map(({ userId, userName, userProfileImage }) => (
                  <div key={userId}>
                    <Avatar src={userProfileImage} alt={userName} />
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
