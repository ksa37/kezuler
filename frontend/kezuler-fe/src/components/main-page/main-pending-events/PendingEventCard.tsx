import React, { useMemo } from 'react';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import classNames from 'classnames';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import useModal from 'src/hooks/useModal';
import { BPendingEvent } from 'src/types/pendingEvent';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import { ReactComponent as HostIcon } from 'src/assets/icn_host.svg';
import { ReactComponent as InfoIcon } from 'src/assets/icn_info_yb.svg';
import { ReactComponent as SendIcon } from 'src/assets/icn_send_yb.svg';

interface Props {
  event: BPendingEvent;
}

function PendingEventCard({ event }: Props) {
  const { openModal } = useModal();
  const { copyText } = useCopyText();

  const {
    eventId,
    eventTitle,
    eventHost: { userId: hostId },
    eventZoomAddress,
    eventTimeCandidates,
  } = event;

  const navigate = useNavigate();

  const handleChangeTime = () => {
    navigate(`${PathName.modify}/${eventId}`);
  };

  const handleInfoClick = () => {
    openModal('Overview', { eventId, isFixed: false });
  };

  const handleConfirmClick = () => {
    navigate(`${PathName.confirm}/${eventId}`);
  };

  const handleInviteClick = () => {
    copyText(`${CURRENT_HOST}${PathName.invite}/${eventId}`, '케줄러 링크가');
  };

  const isHost = useMemo(
    () => hostId === getCurrentUserInfo()?.userId,
    [hostId]
  );

  const isParticipating = useMemo(() => {
    if (isHost) {
      return true;
    }
    const curUserId = getCurrentUserInfo()?.userId;
    return eventTimeCandidates.some((c) =>
      c.possibleUsers.some(({ userId }) => userId === curUserId)
    );
  }, [isHost, eventTimeCandidates]);

  const eventLocation = useMemo(() => {
    if (eventZoomAddress) {
      return '온라인';
    }
    return '오프라인';
  }, [eventZoomAddress]);

  return (
    <section className={'pending-event-card'}>
      <div>
        {eventLocation}
        {isParticipating ? (
          <div className={'pending-event-participate'}>참여</div>
        ) : (
          <div className={classNames('pending-event-participate', 'absent')}>
            미참여
          </div>
        )}
      </div>
      <div>{eventTitle}</div>
      <div>
        {isHost ? (
          <Button
            className={'pending-event-confirm'}
            onClick={handleConfirmClick}
          >
            미팅 시간 확정
          </Button>
        ) : (
          <Button className={'pending-event-change'} onClick={handleChangeTime}>
            가능한 시간 변경
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
      {isHost && <HostIcon className={'pending-event-card-host-badge'} />}
    </section>
  );
}

export default PendingEventCard;
