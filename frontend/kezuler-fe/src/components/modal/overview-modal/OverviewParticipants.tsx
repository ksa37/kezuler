import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar } from '@mui/material';

import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { isFixedEvent } from 'src/utils/typeGuard';

interface Props {
  event: BFixedEvent;
}

function OverviewParticipants({ event }: Props) {
  const { eventHost } = event;
  let { participants } = event;
  participants = [
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
    {
      userId: 'user0003',
      userName: '태인',
      userProfileImage: 'https://example.com',
      userStatus: 'Declined',
    },
  ];

  // const { participants, eventHost } = event;
  const { show } = participantsPopupAction;
  const dispatch = useDispatch();
  const { userName: hostName, userProfileImage: hostProfileImage } = eventHost;

  const handleAllShowClick = () => {
    dispatch(show(event));
  };

  const MAX_PREVIEW_NUM = 5;

  const etcParticipantsNum = useMemo(() => {
    console.log(participants.length, participants.length - MAX_PREVIEW_NUM - 1);
    return participants.length - MAX_PREVIEW_NUM + 1;
  }, [participants]);

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
          <td colSpan={2}>
            {participants
              .slice(
                0,
                participants.length > MAX_PREVIEW_NUM
                  ? MAX_PREVIEW_NUM - 1
                  : MAX_PREVIEW_NUM
              )
              .map((p) => (
                <div key={p.userId} className={'participant-avatar-container'}>
                  <Avatar
                    className={'participant-avatar'}
                    alt={p.userName}
                    src={p.userProfileImage}
                  />
                  <div>{p.userName}</div>
                </div>
              ))}
            {etcParticipantsNum > 0 && (
              <div className={'participant-avatar-container'}>
                <Avatar
                  className={'participant-avatar'}
                  alt={`+${etcParticipantsNum}`}
                >
                  {`+${etcParticipantsNum}`}
                </Avatar>
              </div>
            )}
          </td>
          {/* <td> */}
          {/* {etcParticipantsNum > 0 && (
              <Avatar
                className={'participant-avatar'}
                alt={`+${etcParticipantsNum}`}
              >
                {`+${etcParticipantsNum}`}
              </Avatar>
            )} */}
          {/* </td> */}
        </tr>
      </tbody>
    </table>
  );
}

export default OverviewParticipants;
