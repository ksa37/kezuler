import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import classNames from 'classnames';

import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { BFixedEvent } from 'src/types/fixedEvent';

interface Props {
  event: BFixedEvent;
}

function OverviewParticipants({ event }: Props) {
  const { eventHost, eventId, participants } = event;
  const acceptParticipants = participants.filter(
    (participant) => participant.userStatus === 'Accepted'
  );
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
              className={classNames('participant-avatar', 'is-host')}
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
