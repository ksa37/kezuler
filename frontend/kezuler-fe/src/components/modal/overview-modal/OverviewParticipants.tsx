import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar } from '@mui/material';

import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { BFixedEvent } from 'src/types/fixedEvent';

interface Props {
  event: BFixedEvent;
}

function OverviewParticipants({ event }: Props) {
  const { participants, eventHost } = event;
  const { show } = participantsPopupAction;
  const dispatch = useDispatch();
  const { userName: hostName, userProfileImage: hostProfileImage } = eventHost;

  const handleAllShowClick = () => {
    dispatch(show(event));
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
