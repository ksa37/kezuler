import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CreateMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

import CalendarTimeSelector from './CalendarTimeSelector';
import MeetingInfoForm from './MeetingInfoForm';
import MeetingShare from './MeetingShare';
import OnOffInfoForm from './OnOffInfoForm';
import OnOffSelector from './OnOffSelector';
import SelectedOptions from './SelectedOptions';
import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import 'src/styles/CreateMeeting.scss';

function CreateMeeting() {
  const { step } = useSelector((state: RootState) => state.createMeeting);

  const totalStepsNum = Object.keys(CreateMeetingSteps).length / 2 - 1;
  const progressPerStep = 100 / totalStepsNum;

  const getComponent = (step: CreateMeetingSteps) => {
    switch (step) {
      case CreateMeetingSteps.First:
        return <MeetingInfoForm />;
      case CreateMeetingSteps.Second:
        return <CalendarTimeSelector />;
      case CreateMeetingSteps.Third:
        return <SelectedOptions />;
      case CreateMeetingSteps.Fourth:
        return (
          // <OnOffSelector>
          <OnOffInfoForm />
          // </OnOffSelector>
        );
      case CreateMeetingSteps.Fifth:
        return <MeetingShare />;
      default:
        return <></>;
    }
  };

  const getAppBarText = (step: CreateMeetingSteps) => {
    switch (step) {
      case CreateMeetingSteps.First:
        return '미팅정보 입력';
      case CreateMeetingSteps.Second:
        return '미팅일정 설정';
      case CreateMeetingSteps.Third:
        return '미팅일정 설정';
      case CreateMeetingSteps.Fourth:
        return '미팅장소 설정';
      case CreateMeetingSteps.Fifth:
        return '미팅생성 완료';
      default:
        return '';
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const { decreaseStep } = createMeetingActions;

  const handlePrevClick = () => {
    dispatch(decreaseStep());
  };

  return (
    <div className={'create-meeting-page'}>
      <TextAppBar
        onClick={
          step === CreateMeetingSteps.Fifth ? undefined : handlePrevClick
        }
        text={getAppBarText(step)}
      />
      <ProgressBar progress={progressPerStep * step} />
      <div className={'create-meeting-content'}>{getComponent(step)}</div>
    </div>
  );
}

export default CreateMeeting;
