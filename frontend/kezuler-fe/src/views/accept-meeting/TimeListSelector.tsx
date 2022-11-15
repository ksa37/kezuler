import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import {
  MAX_DECLINE_REASON_LENGTH,
  MAX_DECLINE_REASON_LENGTH_ERROR,
} from 'src/constants/Validation';
import useDialog from 'src/hooks/useDialog';
import {
  useDeletePendingEventGuest,
  usePutPendingEventGuest,
} from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { alertAction } from 'src/reducers/alert';
import { calendarActions } from 'src/reducers/calendarList';
import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { AppDispatch } from 'src/store';
import { PDeletePendingEvent, PPutPendingEvent } from 'src/types/pendingEvent';
import {
  getTimeListDevideByDateWithPossibleNum,
  getTimeRange,
} from 'src/utils/dateParser';
import { getSchedules } from 'src/utils/getCalendar';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import getTimezoneDate, { getUTCDate } from 'src/utils/getTimezoneDate';
import { getDeclineReason } from 'src/utils/joinMeeting';
import { isModification as isModificationfunc } from 'src/utils/joinMeeting';

import AvailableOptionSelector from 'src/components/accept-meeting/AvailableOptionSelector';
import CalendarPairBtn from 'src/components/accept-meeting/CalendarPairBtn';
import ScheduleCard from 'src/components/accept-meeting/ScheduleCard';
import TimeCard from 'src/components/accept-meeting/TimeCard';
import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as ArrowRightIcon } from 'src/assets/icn_right_outline.svg';
import { ReactComponent as ProfilesIcon } from 'src/assets/icon_profiles.svg';
import { ReactComponent as CircleIcon } from 'src/assets/icon_profiles_circle.svg';
import { CircularProgress } from '@mui/material';
import classNames from 'classnames';

interface Props {
  isModification?: boolean;
}
function TimeListSelector({ isModification }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent, availableTimes, declineReason, isDecline } =
    useSelector((state: RootState) => state.acceptMeeting);
  const { calendarList, loaded: calendarLoaded } = useSelector(
    (state: RootState) => state.calendarList
  );
  const { destroy: destroyCalendar } = calendarActions;
  const {
    addAvailableTimes,
    deleteAvailableTimes,
    setDeclineReason,
    setIsDecline,
  } = acceptMeetingActions;

  const {
    eventId,
    eventHost,
    eventTimeDuration,
    declinedUsers,
    eventTimeCandidates,
  } = pendingEvent;

  const { show } = participantsPopupAction;
  const { show: showAlert } = alertAction;

  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const putEventTimeCandidate = usePutPendingEventGuest();
  const deleteEventTimeCandidate = useDeletePendingEventGuest();

  const { googleToggle } = useMemo(() => ({ ...getCurrentUserInfo() }), []);
  const [isCalendarPaired, setIsCalendarPaired] = useState(googleToggle);

  const isHost = useMemo(
    () => eventHost.userId === getCurrentUserInfo()?.userId,
    [eventHost.userId]
  );
  // 가능한 시간 없는 이유 가져옴
  useEffect(() => {
    const declineReasontext = getDeclineReason(declinedUsers);
    if (declineReasontext !== null) {
      dispatch(setDeclineReason(declineReasontext));
      dispatch(setIsDecline(true));
    }
  }, [pendingEvent]);

  useEffect(() => {
    if (isModificationfunc(eventTimeCandidates, declinedUsers)) {
      navigate(`/modify/${eventId}`);
    }
    return () => {
      dispatch(destroyCalendar());
    };
  }, []);

  const handlePutClick = () => {
    if (isHost) {
      dispatch(
        showAlert({
          title: '참여 불가 알림',
          description: '본인이 생성한 미팅에 투표가 불가합니다.',
        })
      );
      navigate(`${PathName.mainPending}`, { replace: true });
      return;
    }

    // 가능한 시간 있을때 활용
    const putData: PPutPendingEvent = {
      addTimeCandidates: availableTimes,
    };

    // 가능한 시간 없을때 활용
    const DeleteData: PDeletePendingEvent =
      declineReason && declineReason !== ''
        ? {
            userDeclineReason: declineReason,
          }
        : {};

    let confirmMeeting;

    if (availableTimes.length !== 0) {
      if (isModification) {
        confirmMeeting = () => {
          putEventTimeCandidate(eventId, putData);
          navigate(PathName.mainPending);
        };
      } else {
        confirmMeeting = () => {
          putEventTimeCandidate(eventId, putData);
          navigate(`${PathName.invite}/${eventId}/complete`);
        };
      }
    } else {
      if (isModification) {
        confirmMeeting = () => {
          deleteEventTimeCandidate(eventId, DeleteData);
          navigate(PathName.mainPending);
        };
      } else {
        confirmMeeting = () => {
          deleteEventTimeCandidate(eventId, DeleteData);
          navigate(`${PathName.invite}/${eventId}/complete`);
        };
      }
    }
    openDialog({
      title: `미팅시간 선택을 ${isModification ? '수정' : '완료'}하시겠어요?`,
      onConfirm: confirmMeeting,
    });
  };

  // selectedOptions availableTimes
  const handleEventTimeClick = (eventStartsAt: Date) => {
    const dateToAdd = getUTCDate(eventStartsAt.getTime()).getTime();
    if (availableTimes.includes(dateToAdd)) {
      dispatch(deleteAvailableTimes(dateToAdd));
    } else {
      dispatch(addAvailableTimes(dateToAdd));
    }
  };

  const handleAllShowClick = () => {
    dispatch(show(pendingEvent));
    navigate(
      `${isModification ? '/modify' : PathName.invite}/${eventId}/${
        isModification ? 'participants' : 'select/participants'
      }`
    );
  };

  const possibleUsersAll = eventTimeCandidates.reduce<string[]>(
    (prev, eventTimeCandidate) => {
      const userIds = eventTimeCandidate.possibleUsers.map((u) => u.userId);
      return prev.concat(userIds.filter((id) => prev.indexOf(id) < 0));
    },
    []
  );
  const declinedUsersAll = declinedUsers.map(
    (declinedUser) => declinedUser.userId
  );

  // const selectedOptions = getSelectedOptions(eventTimeCandidates);

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

  const [error, setError] = useState('');
  useEffect(() => {
    const reasonError =
      declineReason && declineReason.length > MAX_DECLINE_REASON_LENGTH
        ? MAX_DECLINE_REASON_LENGTH_ERROR
        : '';
    setError(reasonError);
  }, [declineReason]);

  const nextButtonDisabled = !!error;

  const isCalendarEmpty = useMemo(() => {
    const concatList = Object.values(calendarList).reduce(
      (pre, cur) => pre.concat(cur),
      []
    );
    return calendarLoaded && concatList.length === 0;
  }, [calendarList]);

  return (
    <div className={'time-list-selector'}>
      <div className={'time-list-top'}>
        <div className={'time-list-top-description'}>
          {'참여 가능한 시간을'}
          <br />
          {'모두 선택해주세요'}
        </div>
        <div className={'time-list-selector-personnel'}>
          <div
            className={'time-list-selector-personnel-item'}
            onClick={handleAllShowClick}
          >
            <CircleIcon className={'icon-circle'} />
            <ProfilesIcon className={'icon-profiles'} />
            {`참여자 보기(${
              possibleUsersAll.length + declinedUsersAll.length
            }명)`}
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
                {dateIdx === 0 && '내 캘린더'}
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
                <div key={dateKey + index} className={'time-select-card-grid'}>
                  {eventTimeListDevideByDate[dateKey].length > index ? (
                    <TimeCard
                      isEmpty={false}
                      isSelected={availableTimes.includes(
                        getUTCDate(
                          eventTimeListDevideByDate[dateKey][
                            index
                          ].eventStartsAt.getTime()
                        ).getTime()
                      )}
                      onClick={() =>
                        handleEventTimeClick(
                          eventTimeListDevideByDate[dateKey][index]
                            .eventStartsAt
                        )
                      }
                      timeRange={getTimeRange(
                        eventTimeListDevideByDate[dateKey][index].eventStartsAt,
                        eventTimeDuration
                      )}
                      possibleNum={
                        availableTimes.includes(
                          eventTimeListDevideByDate[dateKey][
                            index
                          ].eventStartsAt.getTime()
                        )
                          ? eventTimeListDevideByDate[dateKey][index]
                              .possibleNum
                          : eventTimeListDevideByDate[dateKey][index]
                              .possibleNum
                      }
                    />
                  ) : (
                    <TimeCard isEmpty={true} />
                  )}
                  {calendarList &&
                  Object.keys(calendarList).includes(dateKey) &&
                  calendarList[dateKey].length > index ? (
                    <ScheduleCard
                      isEmpty={false}
                      timeRange={calendarList[dateKey][index].timeRange}
                      scheduleTitle={calendarList[dateKey][index].scheduleTitle}
                    />
                  ) : dateIdx === 0 && index === 0 && !calendarLoaded ? (
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
      </div>
      <AvailableOptionSelector errorMessage={error} />
      <BottomButton
        text={isModification ? '수정 완료' : '선택 완료'}
        onClick={handlePutClick}
        disabled={
          (availableTimes.length === 0 && !isDecline) || nextButtonDisabled
        }
      />
    </div>
  );
}

export default TimeListSelector;
