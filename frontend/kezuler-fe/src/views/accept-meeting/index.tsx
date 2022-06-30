import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AcceptMeetingSteps } from 'src/constants/Steps';
import { useGetInvitation } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import AcceptanceCompletion from './AcceptanceCompletion';
import Invitation from './Invitation';
import TimeListSelector from './TimeListSelector';
import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import 'src/styles/AcceptMeeting.scss';
import 'src/styles/common/TimeLineGrid.scss';

function AcceptMeeting() {
  const dispatch = useDispatch<AppDispatch>();
  const { step } = useSelector((state: RootState) => state.acceptMeeting);
  const { decreaseStep, destroy } = acceptMeetingActions;

  const totalStepsNum = Object.keys(AcceptMeetingSteps).length / 2 - 1;
  const progressPerStep = 100 / totalStepsNum;

  useEffect(() => {
    return () => {
      dispatch(destroy());
    };
  }, []);

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

  const getPendingEventInfo = useGetInvitation();

  useMemo(() => {
    if (eventId) {
      getPendingEventInfo(eventId);
    }
  }, [eventId]);

  const handlePrevClick = () => {
    dispatch(decreaseStep());
  };

  return (
    <>
      <TextAppBar
        onClick={
          step === AcceptMeetingSteps.Second ? handlePrevClick : undefined
        }
        text={getAppBarText(step)}
      />
      <ProgressBar progress={progressPerStep * step} yellowBar={true} />
      {getComponent(step)}
    </>
  );
}

export default AcceptMeeting;