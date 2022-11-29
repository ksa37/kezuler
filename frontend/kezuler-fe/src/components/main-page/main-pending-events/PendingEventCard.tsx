import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import classNames from 'classnames';

import PathName, { makePendingInfoUrl } from 'src/constants/PathName';
import { BPendingEvent } from 'src/types/pendingEvent';
import { User } from 'src/types/user';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

interface Props {
  event: BPendingEvent;
}

function PendingEventCard({ event }: Props) {
  const {
    eventId,
    eventTitle,
    eventHost: {
      userId: hostId,
      userName: hostName,
      userProfileImage: hostProfileImage,
    },
    addressType,
    eventTimeCandidates,
    disable,
  } = event;

  const [windowSize, setWindowSize] = useState(getWindowSize());

  const navigate = useNavigate();

  const handleChangeTime = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/modify/${eventId}`);
  };

  const handleInfoClick = () => {
    navigate(makePendingInfoUrl(eventId));
  };

  const handleConfirmClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`${PathName.confirm}/${eventId}`);
  };

  const isHost = useMemo(
    () => hostId === getCurrentUserInfo()?.userId,
    [hostId]
  );

  const eventLocation = useMemo(() => {
    if (addressType === 'OFF') {
      return '오프라인';
    }
    return '온라인';
  }, [addressType]);

  const participantsNum = useMemo(() => {
    const participantsSet = new Set();
    eventTimeCandidates.forEach(({ possibleUsers }) => {
      possibleUsers.forEach(({ userId }) => {
        participantsSet.add(userId);
      });
    });

    return participantsSet.size;
  }, [eventTimeCandidates]);

  const participants = useMemo(() => {
    const participantsArray: User[] = [];
    eventTimeCandidates.forEach(({ possibleUsers }) => {
      possibleUsers.forEach((el) => {
        participantsArray.push(el);
      });
    });

    return participantsArray.reduce<User[]>(function (acc, current) {
      if (acc.findIndex(({ userId }) => userId === current.userId) === -1) {
        acc.push(current);
      }
      return acc;
    }, []);
  }, [eventTimeCandidates]);

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

  return (
    <section
      className={classNames('pending-event-card', {
        'is-host': isHost,
        canceled: disable,
      })}
      onClick={handleInfoClick}
    >
      <div className={classNames({ canceled: disable })}>
        {eventLocation}
        {disable && <span>취소된 미팅</span>}
      </div>
      <div className="pending-event-card-body">
        <div
          className={classNames('pending-event-card-left', {
            canceled: disable,
          })}
        >
          <div
            className={classNames('pending-event-card-title', {
              canceled: disable,
            })}
          >
            {eventTitle}
          </div>
          <div
            className={classNames('fixed-event-card-avatars', 'pending', {
              canceled: disable,
            })}
          >
            <div className={'fixed-event-card-host'}>
              <Avatar
                classes={{
                  root: classNames(
                    'fixed-event-card-avatar-num',
                    'host',
                    'pending'
                  ),
                }}
                className={'fixed-event-card-avatar'}
                key={hostId}
                alt={hostName}
                src={hostProfileImage}
              />
              <div className={classNames('fixed-event-card-host-desc')}>
                호스트
              </div>
            </div>
            {windowSize.innerWidth > 340 ? (
              <div>
                <AvatarGroup
                  max={
                    windowSize.innerWidth > 390
                      ? 4
                      : windowSize.innerWidth > 370
                      ? 3
                      : 2
                  }
                  classes={{
                    avatar: classNames(
                      'fixed-event-card-avatar-num',
                      'pending'
                    ),
                  }}
                >
                  {participants?.map(
                    (p: User) =>
                      p.canceled === false && (
                        <Avatar
                          className={'fixed-event-card-avatar'}
                          key={p.userId}
                          alt={p.userName}
                          src={p.userProfileImage}
                        />
                      )
                  )}
                </AvatarGroup>
                {participants.filter((el) => !el.canceled).length > 0 && (
                  <div className={classNames('fixed-event-card-guest-desc')}>
                    참여자
                  </div>
                )}
              </div>
            ) : participants.length === 1 ? (
              participants.map(
                (p: User) =>
                  p.canceled === false && (
                    <Avatar
                      className={'fixed-event-card-avatar'}
                      classes={{
                        root: classNames(
                          'fixed-event-card-avatar-num',
                          'pending'
                        ),
                      }}
                      key={p.userId}
                      alt={p.userName}
                      src={p.userProfileImage}
                    />
                  )
              )
            ) : (
              participants.length > 1 && (
                <Avatar
                  classes={{
                    root: classNames('fixed-event-card-avatar-num', 'pending'),
                  }}
                  alt={`+${participants.filter((el) => !el.canceled).length}`}
                >
                  {`+${participants.filter((el) => !el.canceled).length}`}
                </Avatar>
              )
            )}
          </div>
        </div>
        <div className="pending-event-card-right">
          {isHost ? (
            <Button
              className={classNames('pending-event-confirm', {
                canceled: disable,
              })}
              onClick={handleConfirmClick}
              disabled={disable}
            >
              시간 확정하기
              <br />
              {`(${participantsNum}명 투표완료)`}
            </Button>
          ) : (
            <Button
              className={classNames('pending-event-change', {
                canceled: disable,
              })}
              onClick={handleChangeTime}
              disabled={disable}
            >
              투표 수정하기
              <br />
              {`(${participantsNum}명 투표완료)`}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default PendingEventCard;
