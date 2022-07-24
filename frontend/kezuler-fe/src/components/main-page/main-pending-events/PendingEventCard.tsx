import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import classNames from 'classnames';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName, { makePendingInfoUrl } from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import { BPendingEvent } from 'src/types/pendingEvent';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import { ReactComponent as InfoIcon } from 'src/assets/icn_info_yb.svg';
import { ReactComponent as SendIcon } from 'src/assets/icn_send_yb.svg';

interface Props {
  event: BPendingEvent;
}

function PendingEventCard({ event }: Props) {
  const { copyText } = useCopyText();

  const {
    eventId,
    eventTitle,
    eventHost: { userId: hostId },
    eventPlace,
    eventTimeCandidates,
    declinedUsers,
  } = event;

  const navigate = useNavigate();

  const handleChangeTime = () => {
    navigate(`/modify/${eventId}`);
  };

  const handleInfoClick = () => {
    navigate(makePendingInfoUrl(eventId));
  };

  const handleConfirmClick = () => {
    navigate(`${PathName.confirm}/${eventId}`);
  };

  const handleInviteClick = () => {
    copyText(
      `${CURRENT_HOST}${PathName.invite}/${eventId}/invitation`,
      '케줄러 링크가'
    );
  };

  const isHost = useMemo(
    () => hostId === getCurrentUserInfo()?.userId,
    [hostId]
  );

  const eventLocation = useMemo(() => {
    if (eventPlace) {
      return '오프라인';
    }
    return '온라인';
  }, [eventPlace]);

  const participantsNum = useMemo(() => {
    const participantsSet = new Set();
    eventTimeCandidates.forEach(({ possibleUsers }) => {
      possibleUsers.forEach(({ userId }) => {
        participantsSet.add(userId);
      });
    });

    return participantsSet.size;
  }, [eventTimeCandidates]);

  return (
    <section
      className={classNames('pending-event-card', {
        'is-host': isHost,
      })}
    >
      <div>
        {eventLocation}
        <span className={'pending-participant-info'}>
          참여
          <span className={'pending-participant-info-num'}>
            {participantsNum}
          </span>
          <span className={'pending-participant-info-divider'} />
          미정
          <span className={'pending-participant-info-num'}>
            {declinedUsers.length}
          </span>
        </span>
      </div>
      <div>{eventTitle}</div>
      <div>
        {isHost ? (
          <Button
            className={'pending-event-confirm'}
            onClick={handleConfirmClick}
          >
            시간 확정하기
          </Button>
        ) : (
          <Button className={'pending-event-change'} onClick={handleChangeTime}>
            투표 수정하기
          </Button>
        )}
        <Button
          startIcon={<InfoIcon />}
          className={'pending-event-info'}
          onClick={handleInfoClick}
          classes={{ startIcon: 'pending-event-icon' }}
        >
          미팅정보
        </Button>
        <Button
          startIcon={<SendIcon />}
          className={'pending-event-info'}
          onClick={handleInviteClick}
          classes={{ startIcon: 'pending-event-icon' }}
        >
          초대링크
        </Button>
      </div>
    </section>
  );
}

export default PendingEventCard;
