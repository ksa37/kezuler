import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import classNames from 'classnames';

import useDialog from 'src/hooks/useDialog';
import useModal from 'src/hooks/useModal';
import { RootState } from 'src/reducers';
import { BPendingEvent } from 'src/types/pendingEvent';

import { ReactComponent as InfoIcon } from 'src/assets/icn_info_yb.svg';
import { ReactComponent as SendIcon } from 'src/assets/icn_send_yb.svg';

interface Props {
  event: BPendingEvent;
}

function PendingEventCard({ event }: Props) {
  const { openDialog } = useDialog();
  const { openModal } = useModal();

  const curUserId = useSelector(
    (state: RootState) => state.mainPending.curUserId
  );

  const {
    eventTitle,
    eventHost: { userId: hostId },
    eventZoomAddress,
    eventTimeCandidates,
  } = event;

  const handleChangeTime = () => {
    console.log('change time');
  };

  const handleInfoClick = () => {
    openModal('Overview', { event });
  };

  const handleConfirmClick = () => {
    const handleConfirm = () => {
      console.log('미팅 시간 확정!');
    };

    openDialog({
      date: '2022년 6월 1일',
      title: '미팅시간을 최종 확정하시겠어요?',
      description: '확정 시, 참여자들에게\n카카오톡 메세지가 전송됩니다.',
      onConfirm: handleConfirm,
    });
  };

  const handleInviteClick = () => {
    console.log('invite click');
  };

  const isHost = useMemo(() => curUserId === hostId, [curUserId, hostId]);

  const isParticipating = useMemo(() => {
    if (isHost) {
      return true;
    }
    return eventTimeCandidates.some((c) =>
      c.possibleUsers.some(({ userId }) => userId === curUserId)
    );
  }, [isHost, eventTimeCandidates, curUserId]);

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
    </section>
  );
}

export default PendingEventCard;
