import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import classNames from 'classnames';
import { usePutPendingEventGuest } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';
import { PPutPendingEvent } from 'src/types/pendingEvent';
import {
  getTimeListDevideByDateWithPossibleNum,
  getTimeRange,
} from 'src/utils/dateParser';

import AvailableOptionSelector from 'src/components/accept-meeting/AvailableOptionSelector';
import ScheduleCard from 'src/components/accept-meeting/ScheduleCard';
import TimeCard from 'src/components/accept-meeting/TimeCard';
import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as ArrowRightIcon } from 'src/assets/arrow_right.svg';
import { ReactComponent as ProfilesIcon } from 'src/assets/icon_profiles.svg';
import { ReactComponent as CircleIcon } from 'src/assets/icon_profiles_circle.svg';

function TimeListSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent, availableTimes, declineReason } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { addAvailableTimes, deleteAvailableTimes } = acceptMeetingActions;

  const { eventId, eventTimeDuration, declinedUsers, eventTimeCandidates } =
    pendingEvent;

  const putEventTimeCandidate = usePutPendingEventGuest();

  const handlePutClick = () => {
    const putData: PPutPendingEvent = { eventTimeCandidates: availableTimes };
    if (availableTimes.length === 0 && declineReason && declineReason !== '') {
      putData.userDeclineReason = declineReason;
    }
    putEventTimeCandidate(eventId, putData);
  };

  const handleEventTimeClick = (eventStartsAt: Date) => {
    const dateToAdd = eventStartsAt.toISOString();
    if (availableTimes.includes(dateToAdd)) {
      dispatch(deleteAvailableTimes(dateToAdd));
    } else {
      dispatch(addAvailableTimes(dateToAdd));
    }
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
        eventStartsAt: new Date(eventTimeCandidate.eventStartsAt),
        possibleNum: eventTimeCandidate.possibleUsers.length,
      }));

    return getTimeListDevideByDateWithPossibleNum(
      eventTimeListWithPossibleNums
    );
  }, [eventTimeCandidates]);

  console.log(eventTimeListDevideByDate);
  // const isSelected = useMemo(() => availableTimes.length > 0, [availableTimes]);

  const [calendarPairOpened, setCalendarPairOpened] = useState(true);
  const handlePairClick = () => {
    setCalendarPairOpened(false);
  };

  type Schedule = {
    timeRange: string;
    scheduleTitle: string;
  };
  interface ScehdulesEachDay {
    [dateString: string]: Schedule[];
  }
  const mockSchedule: ScehdulesEachDay = {
    '4/11 월': [
      { timeRange: '오전 11:00 ~ 오후 10:00', scheduleTitle: '철수랑 저녁' },
      { timeRange: '오후 1:00 ~ 오후 3:00', scheduleTitle: '영희랑 점심' },
    ],
    '4/12 화': [
      { timeRange: '오전 11:00 ~ 오후 1:00', scheduleTitle: '영화관' },
      { timeRange: '하루종일', scheduleTitle: '수아' },
    ],
    '4/13 수': [{ timeRange: '오전 11:00 ~ 오후 1:00', scheduleTitle: '꽃집' }],
    '4/15 금': [
      { timeRange: '하루종일', scheduleTitle: '제주도 여행' },
      { timeRange: '오후 1:00 ~ 오후 3:00', scheduleTitle: '렌트카' },
    ],
  };

  return (
    <div className={'time-list-selector'}>
      <div className={'time-list-top'}>
        <div className={'time-list-top-description'}>
          {'참여 가능한 시간을'}
          <br />
          {'모두 선택해주세요'}
        </div>
        <div className={'time-list-selector-personnel'}>
          <div className={'time-list-selector-personnel-item'}>
            <CircleIcon className={'icon-circle'} />
            <ProfilesIcon className={'icon-profiles'} />
            {`${possibleUsersAll.length + declineNum}명 참여중`}
            <ArrowRightIcon />
          </div>
        </div>
      </div>
      <div className={'time-select-with-schedule'}>
        {calendarPairOpened && (
          <div className={'calendar-pair-ask'}>
            <div className={'calendar-pair-ask-txt'}>
              {'캘린더를 연동하여'}
              <br />
              {'이중약속을 방지해요!'}
            </div>
            <div className={'calendar-pair-ask-btn'} onClick={handlePairClick}>
              <div className={'btn-txt'}>나의 일정 </div>
              <div className={'btn-txt'}>불러오기</div>
            </div>
          </div>
        )}
        <div className={'time-line-line'} />
        {Object.keys(eventTimeListDevideByDate).map((dateKey) => (
          <div key={dateKey} className={'time-select-date'}>
            <div className={'time-select-date-grid'}>
              <div className={'time-select-date-part'}>
                <div className={'time-line-circle'} />
                {dateKey}
              </div>
            </div>
            {Object.keys(mockSchedule).includes(dateKey) &&
            mockSchedule[dateKey].length >
              eventTimeListDevideByDate[dateKey].length
              ? mockSchedule[dateKey].map(
                  ({ timeRange, scheduleTitle }, index) => (
                    <div key={index} className={'time-select-card-grid'}>
                      {eventTimeListDevideByDate[dateKey].length > index ? (
                        <TimeCard
                          isEmpty={false}
                          isSelected={availableTimes.includes(
                            eventTimeListDevideByDate[dateKey][
                              index
                            ].eventStartsAt.toISOString()
                          )}
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
                      <ScheduleCard
                        isEmpty={false}
                        timeRange={timeRange}
                        scheduleTitle={scheduleTitle}
                      />
                    </div>
                  )
                )
              : eventTimeListDevideByDate[dateKey].map(
                  ({ eventStartsAt, possibleNum }, index) => (
                    <div
                      key={eventStartsAt.toTimeString()}
                      className={'time-select-card-grid'}
                    >
                      <TimeCard
                        isEmpty={false}
                        isSelected={availableTimes.includes(
                          eventTimeListDevideByDate[dateKey][
                            index
                          ].eventStartsAt.toISOString()
                        )}
                        onClick={() => handleEventTimeClick(eventStartsAt)}
                        timeRange={getTimeRange(
                          eventStartsAt,
                          eventTimeDuration
                        )}
                        possibleNum={possibleNum}
                      />
                      {Object.keys(mockSchedule).includes(dateKey) &&
                      mockSchedule[dateKey].length > index ? (
                        <ScheduleCard
                          isEmpty={false}
                          timeRange={mockSchedule[dateKey][index].timeRange}
                          scheduleTitle={
                            mockSchedule[dateKey][index].scheduleTitle
                          }
                        />
                      ) : (
                        <ScheduleCard isEmpty={true} />
                      )}
                    </div>
                  )
                )}
          </div>
        ))}
      </div>
      <AvailableOptionSelector />
      <BottomButton text={'선택 완료'} onClick={handlePutClick} />
    </div>
  );
}

export default TimeListSelector;
