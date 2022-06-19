import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useDialog from 'src/hooks/useDialog';
import {
  useDeletePendingEventGuest,
  usePutPendingEventGuest,
} from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { AppDispatch } from 'src/store';
import { PDeletePendingEvent, PPutPendingEvent } from 'src/types/pendingEvent';
import {
  getTimeListDevideByDateWithPossibleNum,
  getTimeRange,
} from 'src/utils/dateParser';
import { getSelectedOptions } from 'src/utils/joinMeeting';

import AvailableOptionSelector from 'src/components/accept-meeting/AvailableOptionSelector';
import CalendarPairBtn from 'src/components/accept-meeting/CalendarPairBtn';
import ScheduleCard from 'src/components/accept-meeting/ScheduleCard';
import TimeCard from 'src/components/accept-meeting/TimeCard';
import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as ArrowRightIcon } from 'src/assets/icn_right_outline.svg';
import { ReactComponent as ProfilesIcon } from 'src/assets/icon_profiles.svg';
import { ReactComponent as CircleIcon } from 'src/assets/icon_profiles_circle.svg';

interface Props {
  isModification?: boolean;
}
function TimeListSelector({ isModification }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent, availableTimes, declineReason } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { addAvailableTimes, deleteAvailableTimes, increaseStep, destroy } =
    acceptMeetingActions;

  const { eventId, eventTimeDuration, declinedUsers, eventTimeCandidates } =
    pendingEvent;

  const { show } = participantsPopupAction;

  const putEventTimeCandidate = usePutPendingEventGuest();
  const deleteEventTimeCandidate = useDeletePendingEventGuest();
  const navigate = useNavigate();
  const { openDialog } = useDialog();

  useEffect(() => {
    if (isModification) {
      return () => {
        dispatch(destroy());
      };
    }
  }, []);

  const handlePutClick = () => {
    const putMeeting = () => {
      const putData: PPutPendingEvent = {
        addTimeCandidates: availableTimes.filter(
          (time) => !selectedOptions.includes(time)
        ),
        removeTimeCandidates: selectedOptions.filter(
          (time) => !availableTimes.includes(time)
        ),
      };
      console.log(availableTimes, selectedOptions);
      console.log(putData);
      if (availableTimes.length === 0) {
        if (declineReason && declineReason !== '') {
          const DeleteData: PDeletePendingEvent = {
            UserDeclineReason: declineReason,
          };
          deleteEventTimeCandidate(eventId, DeleteData);
        } else {
          deleteEventTimeCandidate(eventId);
        }
      } else {
        putEventTimeCandidate(eventId, putData);
      }
      if (isModification) {
        navigate(-1);
        //TODO: main으로 가야하나..?
      } else {
        dispatch(increaseStep());
      }
    };

    openDialog({
      title: `미팅시간 선택을 ${isModification ? '수정' : '완료'}하시겠어요?`,
      onConfirm: putMeeting,
    });
  };

  // selectedOptions availableTimes
  const handleEventTimeClick = (eventStartsAt: Date) => {
    const dateToAdd = eventStartsAt.getTime();
    if (availableTimes.includes(dateToAdd)) {
      dispatch(deleteAvailableTimes(dateToAdd));
    } else {
      dispatch(addAvailableTimes(dateToAdd));
    }
  };

  const handleAllShowClick = () => {
    dispatch(show(pendingEvent));
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

  const selectedOptions = getSelectedOptions(eventTimeCandidates);

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
          <div
            className={'time-list-selector-personnel-item'}
            onClick={handleAllShowClick}
          >
            <CircleIcon className={'icon-circle'} />
            <ProfilesIcon className={'icon-profiles'} />
            {`${possibleUsersAll.length + declinedUsersAll.length}명 참여중`}
            <ArrowRightIcon />
          </div>
        </div>
      </div>
      <div className={'time-select-with-schedule'}>
        {calendarPairOpened && <CalendarPairBtn onClick={handlePairClick} />}
        <div className={'time-line-line'} />
        {Object.keys(eventTimeListDevideByDate).map((dateKey) => (
          <div key={dateKey} className={'time-select-date'}>
            <div className={'time-select-date-grid'}>
              <div className={'time-select-date-part'}>
                <div className={'time-line-circle'} />
                {dateKey}
              </div>
            </div>
            {Array(
              Math.max(
                eventTimeListDevideByDate[dateKey].length,
                Object.keys(mockSchedule).includes(dateKey)
                  ? mockSchedule[dateKey].length
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
                        eventTimeListDevideByDate[dateKey][
                          index
                        ].eventStartsAt.getTime()
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
                  {Object.keys(mockSchedule).includes(dateKey) &&
                  mockSchedule[dateKey].length > index ? (
                    <ScheduleCard
                      isEmpty={false}
                      timeRange={mockSchedule[dateKey][index].timeRange}
                      scheduleTitle={mockSchedule[dateKey][index].scheduleTitle}
                    />
                  ) : (
                    <ScheduleCard isEmpty={true} />
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
      <AvailableOptionSelector />
      <BottomButton
        text={isModification ? '수정 완료' : '선택 완료'}
        onClick={handlePutClick}
      />
    </div>
  );
}

export default TimeListSelector;
