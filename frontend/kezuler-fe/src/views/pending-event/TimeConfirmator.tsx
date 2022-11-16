import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import PathName from 'src/constants/PathName';
import { ConfirmMeetingSteps } from 'src/constants/Steps';
import useDialog from 'src/hooks/useDialog';
import { usePostFixedEvent } from 'src/hooks/useFixedEvent';
import { useGetPendingEvent } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { calendarActions } from 'src/reducers/calendarList';
import { confirmTimeActions } from 'src/reducers/ConfirmTime';
import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { AppDispatch } from 'src/store';
import { PPostFixedEvent } from 'src/types/fixedEvent';
import {
  getTimeListDevideByDateWithPossibleNum,
  getTimeRange,
} from 'src/utils/dateParser';
import { getSchedules } from 'src/utils/getCalendar';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import getTimezoneDate, { getUTCDate } from 'src/utils/getTimezoneDate';

import CompletionPage from '../../components/common/CompletionPage';
import AddTimeBtn from 'src/components/accept-meeting/AddTimeBtn';
import CalendarPairBtn from 'src/components/accept-meeting/CalendarPairBtn';
import ScheduleCard from 'src/components/accept-meeting/ScheduleCard';
import TimeCard from 'src/components/accept-meeting/TimeCard';
import BottomButton from 'src/components/common/BottomButton';
import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import { ReactComponent as ArrowRightIcon } from 'src/assets/icn_right_outline.svg';
import { ReactComponent as ProfilesIcon } from 'src/assets/icon_profiles.svg';
import { ReactComponent as CircleIcon } from 'src/assets/icon_profiles_circle.svg';
import 'src/styles/common/TimeLineGrid.scss';
import 'src/styles/AcceptMeeting.scss';
import classNames from 'classnames';
import { CircularProgress } from '@mui/material';

function TimeConfirmator() {
  const dispatch = useDispatch<AppDispatch>();
  const { step, selectedTime, pendingEvent } = useSelector(
    (state: RootState) => state.confirmTime
  );
  const { setSelctedTime, increaseStep, destroy } = confirmTimeActions;
  const { eventId, eventTimeDuration, declinedUsers, eventTimeCandidates } =
    pendingEvent;
  const { calendarList, loaded: calendarLoaded } = useSelector(
    (state: RootState) => state.calendarList
  );
  const { show } = participantsPopupAction;
  const { openDialog } = useDialog();
  const navigate = useNavigate();

  const totalStepsNum = Object.keys(ConfirmMeetingSteps).length / 2 - 1;
  const progressPerStep = 100 / totalStepsNum;

  const { googleToggle } = useMemo(() => ({ ...getCurrentUserInfo() }), []);
  const [isCalendarPaired, setIsCalendarPaired] = useState(googleToggle);
  const { destroy: destroyCalendar } = calendarActions;

  useEffect(() => {
    return () => {
      dispatch(destroy());
      dispatch(destroyCalendar());
    };
  }, []);

  const { eventConfirmId } = useParams();
  const getPendingEventInfo = useGetPendingEvent();
  useMemo(() => {
    if (eventConfirmId) {
      getPendingEventInfo(eventConfirmId);
    }
  }, [eventConfirmId]);

  const handleEventTimeClick = (eventStartsAt: Date) => {
    dispatch(setSelctedTime(getUTCDate(eventStartsAt.getTime()).getTime()));
  };

  const postFixedEventByConfirm = usePostFixedEvent();
  const handlePostClick = () => {
    const handleConfirm = () => {
      const pfixedEventConfirmed: PPostFixedEvent = {
        pendingEventId: eventId,
        eventTimeStartsAt: selectedTime,
      };
      postFixedEventByConfirm(pfixedEventConfirmed, eventId);
      dispatch(increaseStep());
    };

    const selectedDateText = format(
      getTimezoneDate(new Date(selectedTime).getTime()),
      'yyyy년 M월 d일'
    );
    const selectedTimeText = getTimeRange(
      getTimezoneDate(new Date(selectedTime).getTime()),
      eventTimeDuration
    );

    openDialog({
      date: `${selectedDateText}`,
      timeRange: `${selectedTimeText}`,
      title: '미팅시간을 최종 확정하시겠어요?',
      description: '확정 시, 참여자들에게\n카카오톡 메세지가 전송됩니다.',
      onConfirm: handleConfirm,
    });
  };

  const handlePrevClick = () => {
    navigate(PathName.mainPending);
  };

  const handleAllShowClick = () => {
    dispatch(show(pendingEvent));
    navigate(`${PathName.confirm}/${eventConfirmId}/participants`);
  };

  const processType = location.pathname.split('/')[1];
  const handleAddTimeClick = () => {
    navigate(`/${processType}/${eventConfirmId}/time`);
  };

  const possibleUsersAll = eventTimeCandidates.reduce<string[]>(
    (prev, eventTimeCandidate) => {
      const userIds = eventTimeCandidate.possibleUsers.map((u) => u.userId);
      return prev.concat(userIds.filter((id) => prev.indexOf(id) < 0));
    },
    []
  );
  const declineNum = declinedUsers.length;

  type EventTimeListWithPossibleNum = {
    eventStartsAt: Date;
    possibleNum: number;
  };

  const eventTimeListDevideByDate = useMemo(() => {
    const eventTimeListWithPossibleNums: EventTimeListWithPossibleNum[] =
      eventTimeCandidates.map((eventTimeCandidate) => ({
        eventStartsAt: getTimezoneDate(
          new Date(eventTimeCandidate.eventStartsAt).getTime()
        ),
        possibleNum: eventTimeCandidate.possibleUsers.length,
      }));

    return getTimeListDevideByDateWithPossibleNum(
      eventTimeListWithPossibleNums
    );
  }, [eventTimeCandidates]);

  const { setCalendarStore } = getSchedules(eventTimeListDevideByDate);

  useEffect(() => {
    if (!isCalendarPaired) return;
    if (Object.keys(eventTimeListDevideByDate).length > 0) {
      setCalendarStore();
    }
  }, [eventTimeListDevideByDate, isCalendarPaired]);

  const isCalendarEmpty = useMemo(() => {
    const concatList = Object.values(calendarList).reduce(
      (pre, cur) => pre.concat(cur),
      []
    );
    return calendarLoaded && concatList.length === 0;
  }, [calendarList]);

  return (
    <div className={'accept-wrapper'}>
      <TextAppBar
        onClick={
          step === ConfirmMeetingSteps.First ? handlePrevClick : undefined
        }
        text={'미팅시간 확정'}
      />

      <ProgressBar progress={progressPerStep * step} yellowBar={true} />
      {step === ConfirmMeetingSteps.First ? (
        <div className={'time-list-selector'}>
          <div className={'time-list-top'}>
            <div className={'time-list-top-description'}>
              {'미팅 시간을'}
              <br />
              {'선택해주세요'}
            </div>
            <div className={'time-list-selector-personnel'}>
              <div
                className={'time-list-selector-personnel-item'}
                onClick={handleAllShowClick}
              >
                <CircleIcon className={'icon-circle'} />
                <ProfilesIcon className={'icon-profiles'} />
                {`참여자 보기(${possibleUsersAll.length + declineNum}명)`}
                <ArrowRightIcon />
              </div>
            </div>
          </div>
          <div className={'time-select-with-schedule'}>
            {!isCalendarPaired && (
              <CalendarPairBtn setIsCalendarPaired={setIsCalendarPaired} />
            )}
            <div className={'time-line-line'} />
            {Object.keys(eventTimeListDevideByDate).map((dateKey, dateIdx) => (
              <div key={dateKey} className={'time-select-date'}>
                <div className={'time-select-date-grid'}>
                  <div className={'time-select-my-calendar-part'}>
                    {dateIdx === 0 && isCalendarPaired && '내 캘린더'}
                  </div>
                  <div className={'time-select-date-part'}>
                    <div className={'time-line-circle'} />
                    {dateKey}
                  </div>
                </div>
                {Array(
                  Math.max(
                    eventTimeListDevideByDate[dateKey].length,
                    calendarList && Object.keys(calendarList).includes(dateKey)
                      ? calendarList[dateKey].length
                      : 0
                  )
                )
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={dateKey + index}
                      className={'time-select-card-grid'}
                    >
                      {eventTimeListDevideByDate[dateKey].length > index ? (
                        <TimeCard
                          isEmpty={false}
                          isSelected={
                            selectedTime ===
                            getUTCDate(
                              eventTimeListDevideByDate[dateKey][
                                index
                              ].eventStartsAt.getTime()
                            ).getTime()
                          }
                          onClick={() =>
                            handleEventTimeClick(
                              eventTimeListDevideByDate[dateKey][index]
                                .eventStartsAt
                            )
                          }
                          timeRange={getTimeRange(
                            eventTimeListDevideByDate[dateKey][index]
                              .eventStartsAt,
                            eventTimeDuration
                          )}
                          possibleNum={
                            eventTimeListDevideByDate[dateKey][index]
                              .possibleNum
                          }
                        />
                      ) : (
                        <TimeCard isEmpty={true} />
                      )}
                      {Object.keys(calendarList).includes(dateKey) &&
                      calendarList[dateKey].length > index ? (
                        <ScheduleCard
                          isEmpty={false}
                          timeRange={calendarList[dateKey][index].timeRange}
                          scheduleTitle={
                            calendarList[dateKey][index].scheduleTitle
                          }
                        />
                      ) : dateIdx === 0 &&
                        index === 0 &&
                        isCalendarPaired &&
                        !calendarLoaded ? (
                        <CircularProgress
                          size={20}
                          className={classNames(
                            'time-select-schedule-card',
                            'no-list',
                            'loading-bar'
                          )}
                          disableShrink
                        />
                      ) : dateIdx === 0 && index === 0 && isCalendarEmpty ? (
                        <div
                          className={classNames(
                            'time-select-schedule-card',
                            'no-list'
                          )}
                        >
                          일정이 없습니다.
                        </div>
                      ) : (
                        <ScheduleCard isEmpty={true} />
                      )}
                    </div>
                  ))}
              </div>
            ))}
            <AddTimeBtn onClick={handleAddTimeClick} />
          </div>
          <BottomButton
            text={'미팅시간 확정'}
            onClick={handlePostClick}
            disabled={selectedTime === 0}
          />
        </div>
      ) : (
        <CompletionPage
          boldTextFirst="미팅 시간이"
          boldTextSecond="확정되었습니다."
          regularTextFirst="미팅 참여자들에게"
          regularTextSecond="확정된 일정이 전송되었습니다."
        />
      )}
    </div>
  );
}

export default TimeConfirmator;
