import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';
import { AddTimeSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';
import { calendarActions } from 'src/reducers/calendarList';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import 'src/styles/CreateMeeting.scss';

function AddTime() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventTitle, eventTimeList } = useSelector(
    (state: RootState) => state.createMeeting
  );
  const { destroy } = createMeetingActions;
  const { destroy: destroyCalendar } = calendarActions;
  const location = useLocation();
  const navigate = useNavigate();
  const { eventConfirmId } = useParams();
  const processType = location.pathname.split('/')[1];
  useEffect(() => {
    switch (location.pathname) {
      case `/${processType}/${eventConfirmId}/time/check`: {
        if (eventTitle === '' || eventTimeList.length === 0) {
          navigate(`/${processType}/${eventConfirmId}`);
        }
        break;
      }
    }

    return () => {
      dispatch(destroy());
      dispatch(destroyCalendar());
    };
  }, []);

  const totalStepsNum = Object.keys(AddTimeSteps).length / 2 - 1;
  const progressPerStep = 100 / totalStepsNum;

  const handlePrevClick = () => {
    navigate(-1);
  };

  const handleFirstPrevClick = () => {
    navigate(-1);
  };

  const getAppBarText = () => {
    switch (location.pathname) {
      case `/${processType}/${eventConfirmId}/time`:
        return '미팅일정 추가';
      case `/${processType}/${eventConfirmId}/time/check`:
        return '미팅일정 설정';
      default:
        return '';
    }
  };

  const backgroundSetter = () => {
    switch (location.pathname) {
      case `/${processType}/${eventConfirmId}/time`:
        return 'calendar-selector';
      default:
        return '';
    }
  };

  const getProgressStep = () => {
    switch (location.pathname) {
      case `/${processType}/${eventConfirmId}/time`:
        return 0;
      case `/${processType}/${eventConfirmId}/time/check`:
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

export default AddTime;
