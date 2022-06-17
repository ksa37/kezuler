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

function SelectionModifier() {
  const dispatch = useDispatch<AppDispatch>();
  const { setAvailableTimes } = acceptMeetingActions;
  const { pendingEvent } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { declinedUsers, eventTimeCandidates } = pendingEvent;

  const navigate = useNavigate();

  const getPendingEventInfo = useGetInvitation();

  const { eventModifyId } = useParams();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (eventModifyId) {
      getPendingEventInfo(eventModifyId);
      setIsLoaded(true);
    }
    console.log('first', isModification(eventTimeCandidates, declinedUsers));
  }, [eventModifyId]);

  if (isLoaded && !isModification(eventTimeCandidates, declinedUsers)) {
    navigate(`${PathName.invite}/${eventModifyId}`);
  }
  // } else {
  //   dispatch(setAvailableTimes(getSelectedOptions(eventTimeCandidates)));
  // }
  // useMemo(() => {
  //   console.log('second', isModification(eventTimeCandidates, declinedUsers));

  // }, [isLoaded]);

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
