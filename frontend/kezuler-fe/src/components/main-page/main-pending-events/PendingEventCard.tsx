import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import classNames from 'classnames';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName, { makePendingInfoUrl } from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { AppDispatch } from 'src/store';
import { BPendingEvent } from 'src/types/pendingEvent';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import { ReactComponent as InfoIconGrey } from 'src/assets/icn_info_gr.svg';
import { ReactComponent as InfoIcon } from 'src/assets/icn_info_yb.svg';
import { ReactComponent as SendIconGrey } from 'src/assets/icn_send_gr.svg';
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
    addressType,
    eventTimeCandidates,
    declinedUsers,
    disable,
  } = event;

  const dispatch = useDispatch<AppDispatch>();
  const { show } = participantsPopupAction;

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

  return (
    <section
      className={classNames('pending-event-card', {
        'is-host': isHost,
        canceled: disable,
      })}
      onClick={disable ? handleInfoClick : undefined}
    >
      <div className={classNames({ canceled: disable })}>
        {eventLocation}
        {!disable && (
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
        {disable && <span>취소된 미팅</span>}
      </div>
      <div className={classNames({ canceled: disable })}>{eventTitle}</div>
      <div>
        {isHost ? (
          <Button
            className={classNames('pending-event-confirm', {
              canceled: disable,
            })}
            onClick={handleConfirmClick}
            disabled={disable}
          >
            시간 확정하기
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
          </Button>
        )}
        <Button
          startIcon={disable ? <InfoIconGrey /> : <InfoIcon />}
          className={classNames('pending-event-info', { canceled: disable })}
          onClick={handleInfoClick}
          disabled={disable}
          classes={{ startIcon: 'pending-event-icon' }}
        >
          미팅정보
        </Button>
        <Button
          startIcon={disable ? <SendIconGrey /> : <SendIcon />}
          className={classNames('pending-event-info', { canceled: disable })}
          onClick={handleInviteClick}
          disabled={disable}
          classes={{ startIcon: 'pending-event-icon' }}
        >
          초대링크
        </Button>
      </div>
    </section>
  );
}

export default PendingEventCard;
