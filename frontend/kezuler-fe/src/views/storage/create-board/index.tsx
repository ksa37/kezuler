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
      case `${PathName.storage}/:eventId/add`:
        return '일정자료 추가';
      default:
        return '';
    }
  };

  const backgroundSetter = () => {
    switch (location.pathname) {
      case `${PathName.storage}/:eventId/add`:
        return 'meeting-form';
      default:
        return '';
    }
  };

  const getProgressStep = () => {
    switch (location.pathname) {
      case `${PathName.storage}/:eventId/add`:
        return 0;
      case `${PathName.storage}/:eventId/add/board`:
        return 1;
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
