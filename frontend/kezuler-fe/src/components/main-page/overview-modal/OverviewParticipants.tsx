import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';

import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { BFixedEvent } from 'src/types/fixedEvent';

interface Props {
  event: BFixedEvent;
}

function OverviewParticipants({ event }: Props) {
  const { eventHost } = event;
  const { participants } = event;
  const acceptParticipants = participants.filter(
    (participant) => participant.userStatus === 'Accepted'
  );
  //acceptParticipants = [
  //   {
  //     userId: 'user0003',
  //     userName: 'svsvvds태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  //   {
  //     userId: 'user0003',
  //     userName: '태인',
  //     userProfileImage: 'https://example.com',
  //     userStatus: 'Declined',
  //   },
  // ];

  // const { participants, eventHost } = event;
  const { show } = participantsPopupAction;
  const dispatch = useDispatch();
  const { userName: hostName, userProfileImage: hostProfileImage } = eventHost;

  const handleAllShowClick = () => {
    dispatch(show(event));
  };

  const MAX_PREVIEW_NUM = 5;

  const { avatarElements, avatarNames } = useMemo(() => {
    const Elements: JSX.Element[] = [];
    const Names: JSX.Element[] = [];

    acceptParticipants
      ?.slice(
        0,
        acceptParticipants.length > MAX_PREVIEW_NUM
          ? MAX_PREVIEW_NUM - 1
          : MAX_PREVIEW_NUM
      )
      .forEach((p) => {
        Elements.push(
          <Avatar
            key={p.userId}
            className={'participant-avatar'}
            alt={p.userName}
            src={p.userProfileImage}
          />
        );
        Names.push(
          <div className={'participant-name'} key={p.userId}>
            {p.userName}
          </div>
        );
      });

    return { avatarElements: Elements, avatarNames: Names };
  }, [acceptParticipants]);

  const etcParticipantsNum = useMemo(() => {
    return acceptParticipants.length - MAX_PREVIEW_NUM + 1;
  }, [acceptParticipants]);

  // TODO 작아졌을 때 처리
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
            <Avatar
              className={'participant-avatar'}
              alt={hostName}
              src={hostProfileImage}
            />
          </td>
          <td>{avatarElements}</td>
          <td>
            {etcParticipantsNum > 0 && (
              <Avatar
                className={'participant-avatar number'}
                alt={`+${etcParticipantsNum}`}
              >
                {`+${etcParticipantsNum}`}
              </Avatar>
            )}
          </td>
        </tr>
        <tr>
          <td>
            <div className={'participant-name'}>{hostName}</div>
          </td>
          <td colSpan={2}>{avatarNames}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default OverviewParticipants;
