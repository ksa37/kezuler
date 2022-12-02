import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import classNames from 'classnames';

import useDialog from 'src/hooks/useDialog';
import { RootState } from 'src/reducers';
import { alertAction } from 'src/reducers/alert';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import { getTimeListDevideByDate, getTimeRange } from 'src/utils/dateParser';
import { getSchedules } from 'src/utils/getCalendar';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import getTimezoneDate, { getUTCDate } from 'src/utils/getTimezoneDate';

import CalendarPairBtn from 'src/components/accept-meeting/CalendarPairBtn';
import ScheduleCard from 'src/components/accept-meeting/ScheduleCard';
import BottomButton from 'src/components/common/BottomButton';
import TimeOptionCard from 'src/components/create-meeting/TimeOptionCard';

import 'src/styles/common/TimeLineGrid.scss';

import { addTimes } from 'src/api/addTimes';

function SelectedOptionsAddTime() {
  const dispatch = useDispatch<AppDispatch>();
  const { openDialog } = useDialog();
  const { eventConfirmId } = useParams();
  const { deleteTimeList } = createMeetingActions;
  const { eventTimeList, eventTimeDuration } = useSelector(
    (state: RootState) => state.createMeeting
  );
  const { calendarList, loaded: calendarLoaded } = useSelector(
    (state: RootState) => state.calendarList
  );

  const { show } = alertAction;
  const navigate = useNavigate();
  const { googleToggle } = useMemo(() => ({ ...getCurrentUserInfo() }), []);
  const [isCalendarPaired, setIsCalendarPaired] = useState(googleToggle);

  const eventTimeListDevideByDate = useMemo(
    () =>
      getTimeListDevideByDate(
        eventTimeList.map((utcTime) => getTimezoneDate(utcTime))
      ),
    [eventTimeList]
  );

  const subDescription = `총 ${eventTimeList.length}개 선택`;
  const processType = location.pathname.split('/')[1];

  const handleDeleteClick = (dateKey: string, time: Date) => {
    if (eventTimeList.length === 1) {
      dispatch(
        show({
          title: '1개 이상 선택해야 합니다.',
        })
      );
    } else {
      dispatch(deleteTimeList(getUTCDate(time.getTime()).getTime()));
    }
  };

  const handlePostClick = () => {
    const PostAddTime = () => {
      const navigateToInitialPage = () => {
        if (processType !== 'invite')
          navigate(`/${processType}/${eventConfirmId}`);
        else navigate(`/${processType}/${eventConfirmId}/select`);
      };

      const result = addTimes(eventConfirmId, eventTimeList);
      result
        .then(() => {
          navigateToInitialPage();
          dispatch(
            show({
              title: '새로운 시간이 추가되었습니다!',
            })
          );
        })
        .catch(() => {
          navigateToInitialPage();
          dispatch(
            show({
              title: '시간 추가에 실패하였습니다!',
            })
          );
        });
    };

    openDialog({
      title: `시간을 추가 하시겠어요?`,
      description: `추가시, 기존 미팅에 추가로 선택할 수 있는 시간이 생성됩니다.`,
      onConfirm: PostAddTime,
    });
  };

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
    <div className={'time-list-selector'}>
      <div className={'time-list-top'}>
        <div className={'time-list-top-description'}>
          {'추가할 날짜와 시간을'}
          <br />
          {'확인해주세요'}
        </div>
        <div className={'time-list-selector-personnel'}>{subDescription}</div>
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
                <div key={dateKey + index} className={'time-select-card-grid'}>
                  {eventTimeListDevideByDate[dateKey].length > index ? (
                    <TimeOptionCard
                      isEmpty={false}
                      onDeleteClick={() =>
                        handleDeleteClick(
                          dateKey,
                          eventTimeListDevideByDate[dateKey][index]
                        )
                      }
                      timeRange={getTimeRange(
                        eventTimeListDevideByDate[dateKey][index],
                        eventTimeDuration
                      )}
                    />
                  ) : (
                    <TimeOptionCard isEmpty={true} />
                  )}
                  {Object.keys(calendarList).includes(dateKey) &&
                  calendarList[dateKey].length > index ? (
                    <ScheduleCard
                      isEmpty={false}
                      timeRange={calendarList[dateKey][index].timeRange}
                      scheduleTitle={calendarList[dateKey][index].scheduleTitle}
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
                  ) : dateIdx === 0 &&
                    index === 0 &&
                    isCalendarPaired &&
                    isCalendarEmpty ? (
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
      <BottomButton onClick={handlePostClick} text="확인" />
    </div>
  );
}

export default SelectedOptionsAddTime;
