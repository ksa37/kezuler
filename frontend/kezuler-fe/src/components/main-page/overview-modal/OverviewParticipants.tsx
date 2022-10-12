import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import classNames from 'classnames';

import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { BFixedEvent, FixedUser } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { User } from 'src/types/user';
import { getAllPossibleUsers } from 'src/utils/joinMeeting';
import { isFixedEvent } from 'src/utils/typeGuard';

interface Props {
  event: BFixedEvent | BPendingEvent;
}

function OverviewParticipants({ event }: Props) {
  const { eventHost, eventId } = event;

  let acceptParticipants: FixedUser[] | User[];

  if (isFixedEvent(event)) {
    acceptParticipants = event.participants.filter(
      (participant) => participant.userStatus === 'Accepted'
    );
  } else {
    acceptParticipants = getAllPossibleUsers(event.eventTimeCandidates);
  }
  // const acceptParticipants = participants.filter(
  //   (participant) =>participant.userStatus === 'Accepted'
  // );
  const { show } = participantsPopupAction;
  const dispatch = useDispatch();
  const { userName: hostName, userProfileImage: hostProfileImage } = eventHost;
  const navigate = useNavigate();

  const handleAllShowClick = () => {
    dispatch(show(event));
    navigate(`/main/fixed/${eventId}/info/participants`);
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
            classes={{
              root: 'participant-avatar',
              fallback: 'participant-avatar-fallback',
            }}
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
              classes={{
                root: classNames('participant-avatar', 'is-host'),
                fallback: 'participant-avatar-fallback',
              }}
              alt={hostName}
              src={hostProfileImage}
            />
          </td>
          <td>{avatarElements}</td>
          <td>
            {etcParticipantsNum > 0 && (
              <Avatar
                classes={{
                  root: classNames('participant-avatar', 'number'),
                  fallback: 'participant-avatar-fallback',
                }}
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
