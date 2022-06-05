import React, { useMemo } from 'react';
import { Avatar } from '@mui/material';

import { User } from 'src/types/user';

interface Props {
  host: User;
  participants: User[];
}

function OverviewParticipants({ host, participants }: Props) {
  const { userName: hostName, userProfileImage: hostProfileImage } = host;

  const handleAllShowClick = () => {
    console.log('all click');
  };

  const MAX_PREVIEW_NUM = 4;

  const etcParticipantsNum = useMemo(
    () => participants.length - MAX_PREVIEW_NUM,
    [participants]
  );

  return (
    <table className={'overview-participants-table'}>
      <thead>
        <tr>
          <th>주최자</th>
          <th>참여자</th>
          <th>
            <button className={'all-show-button'} onClick={handleAllShowClick}>
              모두보기
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div className={'participant-avatar-container'}>
              <Avatar
                className={'participant-avatar'}
                alt={hostName}
                src={hostProfileImage}
              />
              <div>{hostName}</div>
            </div>
          </td>
          <td>
            {participants.slice(0, MAX_PREVIEW_NUM + 1).map((p) => (
              <div key={p.userId} className={'participant-avatar-container'}>
                <Avatar
                  className={'participant-avatar'}
                  alt={p.userName}
                  src={p.userProfileImage}
                />
                <div>{p.userName}</div>
              </div>
            ))}
          </td>
          <td>
            {etcParticipantsNum > 0 && (
              <Avatar>{`+${etcParticipantsNum}`}</Avatar>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default OverviewParticipants;
