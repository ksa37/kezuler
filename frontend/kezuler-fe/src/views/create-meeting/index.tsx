import React from 'react';
import { useSelector } from 'react-redux';

import { CreateMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';

import CalendarTimeSelector from './CalendarTimeSelector';
import MeetingInfoForm from './MeetingInfoForm';
import OnOffInfoForm from './OnOffInfoForm';
import OnOffSelector from './OnOffSelector';
import SelectedOptions from './SelectedOptions';
import ProgressBar from 'src/components/ProgressBar';

function CreateMeeting() {
  const { step } = useSelector((state: RootState) => state.createMeeting);

  const totalStepsNum = Object.keys(CreateMeetingSteps).length / 2;
  const progressPerStep = 100 / totalStepsNum;

  const getComponent = (step: CreateMeetingSteps) => {
    switch (step) {
      case CreateMeetingSteps.First:
        return <CalendarTimeSelector />;
      case CreateMeetingSteps.Second:
        return <SelectedOptions />;
      case CreateMeetingSteps.Third:
        return <OnOffSelector />;
      case CreateMeetingSteps.Fourth:
        return <OnOffInfoForm />;
      case CreateMeetingSteps.Fifth:
        return <MeetingInfoForm />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <ProgressBar progress={progressPerStep * step} />
      {getComponent(step)}
    </>
  );
}

export default CreateMeeting;
