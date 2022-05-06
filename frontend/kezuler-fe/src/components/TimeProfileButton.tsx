import { Avatar, AvatarGroup } from '@mui/material';
import React from 'react';
import { PossibleUser } from '../types/pendingEvent';

interface Props {
  onClick: () => void;
  time: string;
  possibleUsersList?: PossibleUser[];
}

function TimeProfileButton({ onClick, time, possibleUsersList }: Props) {
  const possibleUsersNum = possibleUsersList.length;
  const maxAvatarNum = 3;

  return (
    <button className="time-profile-button" onClick={onClick}>
      {time}
      {possibleUsersNum}명 참여중
      <AvatarGroup max={maxAvatarNum} total={possibleUsersNum}>
        {possibleUsersList.map((possibleUser) => {
          <Avatar alt={possibleUser.userId} src={possibleUser.userImage} />;
        })}
      </AvatarGroup>
    </button>
  );
}

export default TimeProfileButton;
