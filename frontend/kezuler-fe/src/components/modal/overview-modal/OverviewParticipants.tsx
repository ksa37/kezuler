import React, { useMemo } from 'react';
import { Avatar } from '@mui/material';

import { EventParticipant } from 'src/types/fixedEvent';

interface Props {
  participants: EventParticipant[];
}

function OverviewParticipants({ participants }: Props) {
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
            <Avatar alt={'hi'} src={'hello'} />
          </td>
          <td>
            {participants.slice(0, MAX_PREVIEW_NUM + 1).map((p) => (
              <Avatar
                key={p.userId}
                sx={{ display: 'inline-flex' }}
                alt={'hi'}
                src={'hello'}
              />
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
