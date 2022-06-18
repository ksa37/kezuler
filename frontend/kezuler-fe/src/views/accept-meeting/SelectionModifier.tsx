import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { useGetInvitation } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';
import { getSelectedOptions, isModification } from 'src/utils/joinMeeting';

import TimeListSelector from './TimeListSelector';
import TextAppBar from 'src/components/common/TextAppBar';

import 'src/styles/common/TimeLineGrid.scss';

function SelectionModifier() {
  const dispatch = useDispatch<AppDispatch>();
  const { setAvailableTimes } = acceptMeetingActions;
  const { pendingEvent, isLoaded } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { declinedUsers, eventTimeCandidates } = pendingEvent;

  const navigate = useNavigate();

  const getPendingEventInfo = useGetInvitation();

  const { eventModifyId } = useParams();

  useEffect(() => {
    if (eventModifyId) {
      getPendingEventInfo(eventModifyId);
    }
    console.log('first', isModification(eventTimeCandidates, declinedUsers));
  }, [eventModifyId]);

  useEffect(() => {
    if (isLoaded && !isModification(eventTimeCandidates, declinedUsers)) {
      navigate(`${PathName.invite}/${eventModifyId}`);
    } else if (isLoaded && isModification(eventTimeCandidates, declinedUsers)) {
      dispatch(setAvailableTimes(getSelectedOptions(eventTimeCandidates)));
    }
  }, [isLoaded]);

  const handlePrevClick = () => {
    navigate(-1);
  };

  return (
    <>
      <TextAppBar onClick={handlePrevClick} text={'선택한 시간 수정'} />
      <TimeListSelector
        isModification={
          isModification(eventTimeCandidates, declinedUsers) as boolean
        }
      />
    </>
  );
}

export default SelectionModifier;
