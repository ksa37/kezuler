import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CreateMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';

import PutMeetingInfo from './PutMeetingInfo';
import PutOnOffInfo from './PutOnOffInfo';
import SelectOnOff from './SelectOnOff';
import SelectTime from './SelectTime';
// import { AppDispatch } from 'src/store';

function CreateMeeting() {
  // const dispatch = useDispatch<AppDispatch>();
  const { step } = useSelector((state: RootState) => state.createMeeting);

  switch (step) {
    case CreateMeetingSteps.First:
      return <SelectTime />;
    case CreateMeetingSteps.Second:
      return <SelectOnOff />;
    case CreateMeetingSteps.Third:
      return <PutOnOffInfo />;
    case CreateMeetingSteps.Fourth:
      return <PutMeetingInfo />;
    default:
      return <></>;
  }
}

export default CreateMeeting;
