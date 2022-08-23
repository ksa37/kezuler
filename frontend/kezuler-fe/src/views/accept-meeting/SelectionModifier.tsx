import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { useGetInvitation } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';
import {
  getDeclineReason,
  getSelectedOptions,
  isModification,
} from 'src/utils/joinMeeting';

import TimeListSelector from './TimeListSelector';
import TextAppBar from 'src/components/common/TextAppBar';

import 'src/styles/common/TimeLineGrid.scss';

function SelectionModifier() {
  const dispatch = useDispatch<AppDispatch>();
  const { setAvailableTimes, setDeclineReason, setIsDecline, destroy } =
    acceptMeetingActions;
  const { pendingEvent, isLoaded } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { declinedUsers, eventTimeCandidates } = pendingEvent;

  const navigate = useNavigate();

  const getPendingEventInfo = useGetInvitation();

  const { eventId } = useParams();

  useEffect(() => {
    return () => {
      dispatch(destroy());
    };
  }, []);

  useEffect(() => {
    if (eventId) {
      getPendingEventInfo(eventId);
    }
    // console.log('first', isModification(eventTimeCandidates, declinedUsers));
  }, [eventId]);

  useEffect(() => {
    if (isLoaded && !isModification(eventTimeCandidates, declinedUsers)) {
      navigate(`${PathName.invite}/${eventId}/invitation`);
    } else if (isLoaded && isModification(eventTimeCandidates, declinedUsers)) {
      dispatch(setAvailableTimes(getSelectedOptions(eventTimeCandidates)));
      const declineReasontext = getDeclineReason(declinedUsers);
      if (declineReasontext !== null) {
        dispatch(setDeclineReason(declineReasontext));
        dispatch(setIsDecline(true));
      }
    }
  }, [isLoaded]);

  const handlePrevClick = () => {
    navigate(PathName.mainPending);
  };

  return (
    <div className={'accept-wrapper'}>
      <TextAppBar onClick={handlePrevClick} text={'선택한 시간 수정'} />
      <TimeListSelector
        isModification={
          isModification(eventTimeCandidates, declinedUsers) as boolean
        }
      />
    </div>
  );
}

export default SelectionModifier;
