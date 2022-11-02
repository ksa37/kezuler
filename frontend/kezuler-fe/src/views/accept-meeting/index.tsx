import React, { useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import classNames from 'classnames';

import { AcceptMeetingSteps } from 'src/constants/Steps';
import { useGetInvitation } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import 'src/styles/AcceptMeeting.scss';
import 'src/styles/common/TimeLineGrid.scss';

function AcceptMeeting() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { destroy } = acceptMeetingActions;

  const navigate = useNavigate();
  const location = useLocation();

  const totalStepsNum = Object.keys(AcceptMeetingSteps).length / 2 - 1;
  const progressPerStep = 100 / totalStepsNum;

  useEffect(() => {
    return () => {
      dispatch(destroy());
    };
  }, []);

  const { eventId } = useParams();

  const getPendingEventInfo = useGetInvitation();

  useMemo(() => {
    if (eventId) {
      getPendingEventInfo(eventId);
    }
  }, [eventId]);

  const isLoaded = useMemo(
    () => pendingEvent.eventTitle !== '',
    [pendingEvent.eventTitle]
  );

  const getAppBarText = () => {
    if (location.pathname.endsWith('/invitation')) return '새로운 미팅 초대';
    else if (location.pathname.endsWith('/select')) return '미팅일정 선택';
    else if (location.pathname.endsWith('/complete'))
      return '미팅일정 선택 완료';
    else return '';
  };
  const getProgressStep = () => {
    if (location.pathname.endsWith('/invitation')) return 0;
    else if (location.pathname.endsWith('/select')) return 1;
    else if (location.pathname.endsWith('/complete')) return 2;
    else return 0;
  };

  const handlePrevClick = () => {
    navigate(-1);
  };

  const isInParticipants = location.pathname.endsWith('/participants');

  return (
    <div
      className={classNames('accept-wrapper', {
        'in-participants': isInParticipants,
        'is-nonMobile': !isMobile,
      })}
    >
      {isLoaded ? (
        <>
          {!isInParticipants && (
            <>
              <TextAppBar
                onClick={
                  location.pathname.endsWith('/select')
                    ? handlePrevClick
                    : undefined
                }
                text={getAppBarText()}
              />
              <ProgressBar
                progress={progressPerStep * getProgressStep()}
                yellowBar={true}
              />
            </>
          )}
          <Outlet />
        </>
      ) : (
        <div className={'circular-progress-bar-wrapper'}>
          <CircularProgress classes={{ root: 'circular-progress-bar' }} />
        </div>
      )}
    </div>
  );
}

export default AcceptMeeting;
