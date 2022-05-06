import { Avatar, AvatarGroup } from '@mui/material';
import React from 'react';
import PendingEvent, { PossibleUser } from '../types/pendingEvent';
import TimeProfileButton from './TimeProfileButton';

interface Props {
  onClick: () => void;
  date: string;
  duration: number;
  eventTimeCandidates: EventTimeCandidate[];
}

function TimeProfileButtonList({
  onClick,
  date,
  duration,
  eventTimeCandidates,
}: Props) {
  const timeCandidates = eventTimeCandidates[date];
  //duration 계산하는거 넣어야함
  return (
    <>
      {timeCandidates.map((timeCandidate) => {
        <TimeProfileButton
          onClick={onClick}
          time={timeCandidate.eventStartsAt}
          possibleUsersList={timeCandidate.possibleUsers}
        />;
      })}
    </>
  );
}

export default TimeProfileButtonList;
