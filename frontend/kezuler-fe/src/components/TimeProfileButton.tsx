import React from 'react';
import { Avatar, AvatarGroup } from '@mui/material';

import { PossibleUser } from 'src/types/pendingEvent';

interface Props {
  onClick: () => void;
  eventStartsAt: string;
  eventTimeDuration: number;
  possibleUsersList?: PossibleUser[];
}

function TimeProfileButton({
  onClick,
  eventStartsAt,
  possibleUsersList,
}: Props) {
  const possibleUsersNum = possibleUsersList?.length;
  const maxAvatarNum = 3;

  //duration 계산하는거 넣어야함
  // const getStartHour = eventStartsAt.split(':')[0];
  // const getStartMinute = eventStartsAt.split(':')[1];
  // let endTime = '';
  // switch(getStartMinute){
  //   case '00':
  //     endTime = getStartHour + ':' + '30';
  //           break;
  //   case '30'
  //   endTime = getStartHour + ':' + '30';

  //     break;
  //   default:
  //     console.log('eventStartsAt time error');
  // }

  return (
    <button className="time-profile-button" onClick={onClick}>
      {eventStartsAt}
      {possibleUsersNum}명 참여중
      {/* <AvatarGroup max={maxAvatarNum} total={possibleUsersNum}>
        {possibleUsersList?.map((possibleUser) => {
          return (
            <Avatar
              key={possibleUser.userId}
              alt={possibleUser.userId}
              src={possibleUser.userProfileImage}
            />
          );
        })}
      </AvatarGroup> */}
    </button>
  );
}

export default TimeProfileButton;
