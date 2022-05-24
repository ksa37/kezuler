import React from 'react';
import { useSelector } from 'react-redux';

import { CreateMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';

import CalendarTimeSelector from './CalendarTimeSelector';
import MeetingInfoForm from './MeetingInfoForm';
import OnOffInfoForm from './OnOffInfoForm';
import OnOffSelector from './OnOffSelector';
import SelectedOptions from './SelectedOptions';

function CreateMeeting() {
  const { step } = useSelector((state: RootState) => state.createMeeting);

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
}

export default CreateMeeting;
