import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';
import { CreateMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

import CalendarTimeSelector from './CalendarTimeSelector';
import MeetingInfoForm from './MeetingInfoForm';
import MeetingShare from './MeetingShare';
import OnOffSelector from './OnOffSelector';
import SelectedOptions from './SelectedOptions';
import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import 'src/styles/CreateMeeting.scss';

function CreateMeeting() {
  const dispatch = useDispatch<AppDispatch>();
  const { step } = useSelector((state: RootState) => state.createMeeting);
  const { decreaseStep, destroy } = createMeetingActions;

  useEffect(() => {
    return () => {
      dispatch(destroy());
    };
  }, []);

  const totalStepsNum = Object.keys(CreateMeetingSteps).length / 2 - 1;
  const progressPerStep = 100 / totalStepsNum;

  const getComponent = useCallback(() => {
    switch (step) {
      case CreateMeetingSteps.First:
        return <MeetingInfoForm />;
      case CreateMeetingSteps.Second:
        return <CalendarTimeSelector />;
      case CreateMeetingSteps.Third:
        return <SelectedOptions />;
      case CreateMeetingSteps.Fourth:
        return <OnOffSelector />;
      case CreateMeetingSteps.Fifth:
        return <MeetingShare />;
      default:
        return <></>;
    }
  }, [step]);

  const getAppBarText = useCallback(() => {
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
  }, [step]);

  const handlePrevClick = () => {
    dispatch(decreaseStep());
  };

  const navigate = useNavigate();
  const handleFirstPrevClick = () => {
    navigate(-1);
  };

  const backgroundSetter = () => {
    switch (step) {
      case CreateMeetingSteps.First:
        return 'meeting-form';
      case CreateMeetingSteps.Second:
        return 'calendar-selector';
      case CreateMeetingSteps.Third:
        return '';
      case CreateMeetingSteps.Fourth:
        return 'place-info';
      case CreateMeetingSteps.Fifth:
        return '';
      default:
        return '';
    }
  };

  return (
    <>
      <TextAppBar
        onClick={
          step === CreateMeetingSteps.First
            ? handleFirstPrevClick
            : step === CreateMeetingSteps.Fifth
            ? undefined
            : handlePrevClick
        }
        text={getAppBarText()}
        mainColored={step === CreateMeetingSteps.First}
      />
      <ProgressBar progress={progressPerStep * step} />
      <div className={classNames('create-meeting-page', backgroundSetter())}>
        {getComponent()}
      </div>
      {/* <div className={classNames('bottom-style', backgroundSetter())}></div> */}
    </>
  );
}

export default CreateMeeting;
