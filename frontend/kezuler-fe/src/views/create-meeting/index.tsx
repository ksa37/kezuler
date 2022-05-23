import React from 'react';
import { useSelector } from 'react-redux';

import { CreateMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';

import CalendarTimeSelector from './CalendarTimeSelector';
import MeetingInfoForm from './MeetingInfoForm';
import OnOffInfoForm from './OnOffInfoForm';
import OnOffSelector from './OnOffSelector';
// import { AppDispatch } from '../../store/store';

function CreateMeeting() {
  // const dispatch = useDispatch<AppDispatch>();
  const { step } = useSelector((state: RootState) => state.createMeeting);

  switch (step) {
    case CreateMeetingSteps.First:
      return <CalendarTimeSelector />;
    case CreateMeetingSteps.Second:
      return <OnOffSelector />;
    case CreateMeetingSteps.Third:
      return <OnOffInfoForm />;
    case CreateMeetingSteps.Fourth:
      return <MeetingInfoForm />;
    default:
      return <></>;
  }
}

export default CreateMeeting;
