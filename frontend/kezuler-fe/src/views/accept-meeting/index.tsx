import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AcceptMeetingSteps } from 'src/constants/Steps';
import { useGetPendingEvent } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';
import { PendingEvent } from 'src/types/pendingEvent';

import AcceptanceCompletion from './AcceptanceCompletion';
import Invitation from './Invitation';
import TimeListSelector from './TimeListSelector';
import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import 'src/styles/AcceptMeeting.scss';

function AcceptMeeting() {
  const dispatch = useDispatch<AppDispatch>();
  const { step, pendingEvent } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { setEventID, setPendingEvent } = acceptMeetingActions;

  const totalStepsNum = Object.keys(AcceptMeetingSteps).length / 2 - 1;
  const progressPerStep = 100 / totalStepsNum;

  const getComponent = (step: AcceptMeetingSteps) => {
    switch (step) {
      case AcceptMeetingSteps.First:
        return <Invitation />;
      case AcceptMeetingSteps.Second:
        return <TimeListSelector />;
      case AcceptMeetingSteps.Third:
        return <AcceptanceCompletion />;
      default:
        return <></>;
    }
  };

  const getAppBarText = (step: AcceptMeetingSteps) => {
    switch (step) {
      case AcceptMeetingSteps.First:
        return '새로운 미팅 초대';
      case AcceptMeetingSteps.Second:
        return '미팅일정 선택';
      case AcceptMeetingSteps.Third:
        return '';
      default:
        return '';
    }
  };
  const { eventId } = useParams();

  const { decreaseStep } = acceptMeetingActions;
  const getPendingEventInfo = useGetPendingEvent();
  useMemo(() => {
    if (eventId) getPendingEventInfo(eventId);
  }, [eventId]);

  const handlePrevClick = () => {
    dispatch(decreaseStep());
  };

  return (
    <div className={'accept-meeting-page'}>
      <div className={'accept-meeting-sticky-header'}>
        <TextAppBar onClick={handlePrevClick} text={getAppBarText(step)} />
        <ProgressBar progress={progressPerStep * step} yellowBar={true} />
      </div>
      {getComponent(step)}
    </div>
  );
}

export default AcceptMeeting;
