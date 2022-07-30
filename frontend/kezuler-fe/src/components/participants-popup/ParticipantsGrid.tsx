import React from 'react';
import Avatar from '@mui/material/Avatar';
import classNames from 'classnames';

import { FixedUser } from 'src/types/fixedEvent';
import { DeclinedUser } from 'src/types/pendingEvent';
import { isDeclinedUser } from 'src/utils/typeGuard';

import { ReactComponent as Comment32Icon } from 'src/assets/img_coments_32.svg';

interface Props {
  isHost: boolean;
  isFixed: boolean;
  isAttendant: boolean;
  users: FixedUser[] | DeclinedUser[];
}

function ParticipantsGrid({ isHost, isFixed, isAttendant, users }: Props) {
  const makeSectionId = (userId: string) => `user-section-${userId}`;

  const handleNameClick = (userId: string) => () => {
    const targetId = makeSectionId(userId);
    const element = document.getElementById(targetId);
    element?.scrollIntoView({ inline: 'center', behavior: 'smooth' });
  };
  console.log(isHost, isFixed, isAttendant);
  return (
    <>
      {users.length === 0 && (
        <div className={'no-decline-users'}>
          {isFixed && isAttendant
            ? '참여 '
            : isFixed && !isAttendant
            ? '불참 '
            : '미정 '}
          인원이 없습니다.
        </div>
      )}
      <div className={'participants-popup-list'}>
        {users.map((user) => {
          const { userId, userProfileImage, userName } = user;
          if (isHost && isDeclinedUser(user)) {
            return (
              <button
                className={classNames(
                  'participants-popup-participant',
                  'declined'
                )}
                key={userId}
                onClick={handleNameClick(userId)}
              >
                <Avatar
                  className={'participant-avatar'}
                  src={userProfileImage}
                  alt={userName}
                />
                <span>{userName}</span>
                <Comment32Icon className={'participant-comment'} />
              </button>
            );
          }
          return (
            <div className={'participants-popup-participant'} key={userId}>
              <Avatar
                className={'participant-avatar'}
                src={userProfileImage}
                alt={userName}
              />
              <span>{userName}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ParticipantsGrid;
