import React from 'react';
import { Avatar, AvatarGroup } from '@mui/material';

import PendingEvent, {
  EventTimeCandidate,
  PossibleUser,
} from '../types/pendingEvent';

import TimeProfileButton from './TimeProfileButton';

interface Props {
  onClick: () => void;
  date: string;
  duration: number;
  eventTimeCandidate: EventTimeCandidate;
}

function TimeProfileButtonList({
  onClick,
  date,
  duration,
  eventTimeCandidate,
}: Props) {
  const users = eventTimeCandidate[date];
  //duration 계산하는거 넣어야함
  return (
    <>
      {users.map((user) => {
        return (
          <TimeProfileButton
            key={user.eventStartsAt}
            onClick={onClick}
            time={user.eventStartsAt}
            possibleUsersList={user.possibleUsers}
          />
        );
      })}
    </>
  );
}

export default TimeProfileButtonList;
