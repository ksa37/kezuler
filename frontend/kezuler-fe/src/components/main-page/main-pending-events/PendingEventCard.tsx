import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import classNames from 'classnames';

import PathName, { makePendingInfoUrl } from 'src/constants/PathName';
import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { shareAction } from 'src/reducers/share';
import { AppDispatch } from 'src/store';
import { BPendingEvent } from 'src/types/pendingEvent';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import ShareIcons from 'src/components/common/ShareIcons';

import { ReactComponent as InfoIconGrey } from 'src/assets/icn_info_gr.svg';
import { ReactComponent as InfoIcon } from 'src/assets/icn_info_yb.svg';
import { ReactComponent as SendIconGrey } from 'src/assets/icn_send_gr.svg';
import { ReactComponent as SendIcon } from 'src/assets/icn_send_yb.svg';

interface Props {
  event: BPendingEvent;
}

function PendingEventCard({ event }: Props) {
  const {
    eventId,
    eventTitle,
    eventHost: { userId: hostId },
    addressType,
    eventTimeCandidates,
    declinedUsers,
    disable: isCanceled,
  } = event;

  const dispatch = useDispatch<AppDispatch>();
  const { show } = participantsPopupAction;
  const { show: showShare } = shareAction;

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
    dispatch(
      showShare({
        title: '케줄러링크 공유하기',
        element: (
          <ShareIcons eventTitle={eventTitle} eventId={eventId} forPopup />
        ),
      })
    );
  };

  const handleParticipantsShow = () => {
    dispatch(show(event));
    navigate(`${PathName.mainPending}/${eventId}/participants`);
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

  // 모든 날짜가 이전 날짜인 경우
  const isPast = useMemo(() => {
    if (!eventTimeCandidates.length) {
      return false;
    }
    const lastEventStartTime =
      eventTimeCandidates[eventTimeCandidates.length - 1].eventStartsAt;
    return lastEventStartTime < new Date().getTime();
  }, [eventTimeCandidates]);

  const isDisabled = useMemo(() => isCanceled, [isPast, isCanceled]);

  return (
    <section
      className={classNames('pending-event-card', {
        'is-host': isHost,
        canceled: isDisabled,
      })}
      onClick={isDisabled ? handleInfoClick : undefined}
    >
      <div className={classNames({ canceled: isDisabled })}>
        {eventLocation}
        {isCanceled ? (
          <span>취소된 미팅</span>
        ) : isPast ? (
          <span>만료된 미팅</span>
        ) : (
          <span
            className={'pending-participant-info'}
            onClick={handleParticipantsShow}
          >
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
        )}
      </div>
      <div className={classNames({ canceled: isDisabled })}>{eventTitle}</div>
      <div>
        {isHost ? (
          <Button
            className={classNames('pending-event-confirm', {
              canceled: isDisabled,
            })}
            onClick={handleConfirmClick}
            disabled={isDisabled}
          >
            시간 확정하기
          </Button>
        ) : (
          <Button
            className={classNames('pending-event-change', {
              canceled: isDisabled,
            })}
            onClick={handleChangeTime}
            disabled={isDisabled}
          >
            투표 수정하기
          </Button>
        )}
        <Button
          startIcon={isDisabled ? <InfoIconGrey /> : <InfoIcon />}
          className={classNames('pending-event-info', { canceled: isDisabled })}
          onClick={handleInfoClick}
          disabled={isDisabled}
          classes={{ startIcon: 'pending-event-icon' }}
        >
          미팅정보
        </Button>
        <Button
          startIcon={isDisabled ? <SendIconGrey /> : <SendIcon />}
          className={classNames('pending-event-info', { canceled: isDisabled })}
          onClick={handleInviteClick}
          disabled={isDisabled}
          classes={{ startIcon: 'pending-event-icon' }}
        >
          공유하기
        </Button>
      </div>
    </section>
  );
}

export default PendingEventCard;
