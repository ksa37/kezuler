import React, { useEffect, useMemo, useState } from 'react';
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
  let acceptParticipants = participants.filter(
    (participant) => participant.userStatus === 'Accepted'
  );
  acceptParticipants = [
    {
      userId: 'user0003',
      userName: 'svsvvds태인',
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

  // TODO 작아졌을 때 처리
  const [windowSize, setWindowSize] = useState(getWindowSize());

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const MAX_PREVIEW_NUM = useMemo(() => {
    if (windowSize.innerWidth > 440) {
      return 5;
      console.log('cscsdc');
    } else if (windowSize.innerWidth > 400) {
      return 4;
    } else if (windowSize.innerWidth > 330) {
      return 3;
    } else {
      return 2;
    }
  }, [windowSize]);

  const { avatarElements, avatarNames } = useMemo(() => {
    const Elements: JSX.Element[] = [];
    const Names: JSX.Element[] = [];
    console.log('avartar');
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
  }, [acceptParticipants, MAX_PREVIEW_NUM]);

  const etcParticipantsNum = useMemo(() => {
    console.log('etcParticipantsNum');
    return acceptParticipants.length - MAX_PREVIEW_NUM + 1;
  }, [acceptParticipants, MAX_PREVIEW_NUM]);

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
