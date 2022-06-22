import React from 'react';
import { Avatar } from '@mui/material';

import { DeclinedUser } from 'src/types/pendingEvent';

import { ReactComponent as Comment20Icon } from 'src/assets/img_coments_20.svg';

interface Props {
  users: DeclinedUser[];
}

function ParticipantsReasons({ users }: Props) {
  const makeSectionId = (userId: string) => `user-section-${userId}`;

  return (
    <>
      <h1 className={'participants-popup-reason-title'}>
        <Comment20Icon className={'participants-popup-reason-title-icon'} />
        참여가 어려운 이유를 확인하세요
      </h1>
      <div className={'participants-popup-reason-container'}>
        {users
          .filter(({ userDeclineReason }) => !!userDeclineReason)
          .map(({ userId, userProfileImage, userName, userDeclineReason }) => (
            <section
              className={'participants-popup-reason'}
              id={makeSectionId(userId)}
              key={userId}
            >
              {/*TODO*/}
              <div className={'participants-popup-reason-text'}>
                {userDeclineReason}
              </div>
              <div className={'participants-popup-reason-info'}>
                <Avatar
                  className={'participants-popup-reason-avatar'}
                  src={userProfileImage}
                  alt={userName}
                />
                {userName}
              </div>
            </section>
          ))}
      </div>
    </>
  );
}

export default ParticipantsReasons;
