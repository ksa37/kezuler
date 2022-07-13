import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';

import { RootState } from 'src/reducers';
import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { AppDispatch } from 'src/store';
import { FixedUser } from 'src/types/fixedEvent';
import { DeclinedUser, EventTimeCandidate } from 'src/types/pendingEvent';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import { isFixedEvent } from 'src/utils/typeGuard';

import ParticipantTab from './ParticipantTab';
import CommonAppBar from 'src/components/common/CommonAppBar';
import ParticipantsEventList from 'src/components/participants-popup/ParticipantsEventList';
import ParticipantsGrid from 'src/components/participants-popup/ParticipantsGrid';
import ParticipantsReasons from 'src/components/participants-popup/ParticipantsReasons';

import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';
import 'src/styles/participantesPopup.scss';

function ParticipantsPopup() {
  const dispatch = useDispatch<AppDispatch>();
  const { hide } = participantsPopupAction;
  const { isOpen, event } = useSelector(
    (state: RootState) => state.participantsPopup
  );
  const [isAttendant, setIsAttendant] = useState(true);

  const { attendants, absents } = useMemo<{
    attendants: FixedUser[] | EventTimeCandidate[];
    absents: FixedUser[] | DeclinedUser[];
  }>(() => {
    if (!event) {
      return { attendants: [], absents: [] };
    }
    if (isFixedEvent(event)) {
      const attendants: FixedUser[] = [];
      const absents: FixedUser[] = [];
      event.participants.forEach((p) =>
        (p.userStatus === 'Accepted' ? attendants : absents).push(p)
      );
      return { attendants, absents };
    }
    return {
      attendants: event.eventTimeCandidates,
      absents: event.declinedUsers,
    };
  }, [event]);

  const isHost = useMemo(() => {
    if (!event) {
      return false;
    }
    return event.eventHost.userId === getCurrentUserInfo()?.userId;
  }, [event]);

  const targetUsers = isAttendant ? attendants : absents;

  const handleClose = () => {
    setIsAttendant(true);
    dispatch(hide());
  };

  const attendantsAll = (attendants: EventTimeCandidate[]) =>
    attendants.reduce<string[]>((prev, eventTimeCandidate) => {
      const userIds = eventTimeCandidate.possibleUsers.map((u) => u.userId);
      return prev.concat(userIds.filter((id) => prev.indexOf(id) < 0));
    }, []);

  return !!event && isOpen
    ? ReactDOM.createPortal(
        <div className={'participants-popup'}>
          <CommonAppBar>
            <div className={'participants-popup-header'}>
              참여자 리스트
              <IconButton
                className={'participants-popup-header-close'}
                onClick={handleClose}
                size={'small'}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </CommonAppBar>
          <div className={'participants-popup-main'}>
            <ParticipantTab
              isAttendant={isAttendant}
              setIsAttendant={setIsAttendant}
              attendantsNum={
                isFixedEvent(event)
                  ? attendants.length
                  : attendantsAll(attendants as EventTimeCandidate[]).length
              }
              absentsNum={absents.length}
            />
            {!isFixedEvent(event) && isAttendant ? (
              <ParticipantsEventList
                candidates={targetUsers as EventTimeCandidate[]}
                eventDuration={event.eventTimeDuration}
              />
            ) : (
              <ParticipantsGrid
                isHost={isHost}
                users={targetUsers as FixedUser[] | DeclinedUser[]}
              />
            )}
            {isHost && !isAttendant && !isFixedEvent(event) && (
              <ParticipantsReasons users={targetUsers as DeclinedUser[]} />
            )}
          </div>
        </div>,
        document.getElementById('App') || document.body
      )
    : null;
}

export default ParticipantsPopup;
