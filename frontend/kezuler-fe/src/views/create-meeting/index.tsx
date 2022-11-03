import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';
import { CreateMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';
import { calendarActions } from 'src/reducers/calendarList';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import 'src/styles/CreateMeeting.scss';

function CreateMeeting() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventTitle, eventTimeList, shareUrl } = useSelector(
    (state: RootState) => state.createMeeting
  );
  const { destroy } = createMeetingActions;
  const { destroy: destroyCalendar } = calendarActions;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    switch (location.pathname) {
      case PathName.createTime: {
        if (eventTitle === '') {
          navigate(PathName.createInfo);
        }
        break;
      }
      case PathName.createCheck: {
        if (eventTitle === '' || eventTimeList.length === 0) {
          navigate(PathName.createInfo);
        }
        break;
      }
      case PathName.createPlace: {
        if (eventTitle === '' || eventTimeList.length === 0) {
          navigate(PathName.createInfo);
        }
        break;
      }
      case PathName.createComplete: {
        if (shareUrl === '') {
          navigate(PathName.createInfo);
        }
        break;
      }
    }

    return () => {
      dispatch(destroy());
      dispatch(destroyCalendar());
    };
  }, []);

  const totalStepsNum = Object.keys(CreateMeetingSteps).length / 2 - 1;
  const progressPerStep = 100 / totalStepsNum;

  const handlePrevClick = () => {
    navigate(-1);
  };

  const handleFirstPrevClick = () => {
    navigate(-1);
  };

  const getAppBarText = () => {
    switch (location.pathname) {
      case PathName.createInfo:
        return '미팅정보 입력';
      case PathName.createTime:
        return '미팅일정 설정';
      case PathName.createCheck:
        return '미팅일정 설정';
      case PathName.createPlace:
        return '미팅장소 설정';
      case PathName.createComplete:
        return '미팅생성 완료';
      default:
        return '';
    }
  };

  const backgroundSetter = () => {
    switch (location.pathname) {
      case PathName.createInfo:
        return 'meeting-form';
      case PathName.createTime:
        return 'calendar-selector';
      case PathName.createCheck:
        return '';
      case PathName.createPlace:
        return 'place-info';
      case PathName.createComplete:
        return '';
      default:
        return '';
    }
  };

  const getProgressStep = () => {
    switch (location.pathname) {
      case PathName.createInfo:
        return 0;
      case PathName.createTime:
        return 1;
      case PathName.createCheck:
        return 2;
      case PathName.createPlace:
        return 3;
      case PathName.createComplete:
        return 4;
      default:
        return 0;
    }
  };

  return (
    <>
      <TextAppBar
        onClick={
          location.pathname === PathName.createInfo
            ? handleFirstPrevClick
            : location.pathname === PathName.createComplete
            ? undefined
            : handlePrevClick
        }
        text={getAppBarText()}
        mainColored={location.pathname === PathName.createInfo}
      />
      <ProgressBar progress={progressPerStep * getProgressStep()} />
      <div className={classNames('create-meeting-page', backgroundSetter())}>
        <Outlet />
      </div>
    </>
  );
}

export default CreateMeeting;
