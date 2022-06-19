import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { ConfirmMeetingSteps } from 'src/constants/Steps';
import useDialog from 'src/hooks/useDialog';
import { usePostFixedEvent } from 'src/hooks/useFixedEvent';
import { useGetPendingEvent } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { confirmTimeActions } from 'src/reducers/ConfirmTime';
import { participantsPopupAction } from 'src/reducers/ParticipantsPopup';
import { AppDispatch } from 'src/store';
import { PPostFixedEvent } from 'src/types/fixedEvent';
import {
  getTimeListDevideByDateWithPossibleNum,
  getTimeRange,
} from 'src/utils/dateParser';

import CompletionPage from '../../components/common/CompletionPage';
import ScheduleCard from 'src/components/accept-meeting/ScheduleCard';
import TimeCard from 'src/components/accept-meeting/TimeCard';
import BottomButton from 'src/components/common/BottomButton';
import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import { ReactComponent as ArrowRightIcon } from 'src/assets/icn_right_outline.svg';
import { ReactComponent as ProfilesIcon } from 'src/assets/icon_profiles.svg';
import { ReactComponent as CircleIcon } from 'src/assets/icon_profiles_circle.svg';
import 'src/styles/common/TimeLineGrid.scss';

function TimeConfirmator() {
  const dispatch = useDispatch<AppDispatch>();
  const { step, selectedTime, pendingEvent } = useSelector(
    (state: RootState) => state.confirmTime
  );
  const { setSelctedTime, increaseStep, decreaseStep, destroy } =
    confirmTimeActions;
  const { eventId, eventTimeDuration, declinedUsers, eventTimeCandidates } =
    pendingEvent;
  const { show } = participantsPopupAction;
  const { openDialog } = useDialog();

  const totalStepsNum = Object.keys(ConfirmMeetingSteps).length / 2 - 1;
  const progressPerStep = 100 / totalStepsNum;

  useEffect(() => {
    return () => {
      dispatch(destroy());
    };
  }, []);

  const { eventConfirmId } = useParams();
  const getPendingEventInfo = useGetPendingEvent();
  useMemo(() => {
    if (eventConfirmId) {
      getPendingEventInfo(eventConfirmId, 1);
    }
  }, [eventConfirmId]);

  const handleEventTimeClick = (eventStartsAt: Date) => {
    dispatch(setSelctedTime(eventStartsAt.getTime()));
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

    const selectedDateText = format(new Date(selectedTime), 'yyyy년 M월 d일');
    const selectedTimeText = getTimeRange(
      new Date(selectedTime),
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
    console.log('prev!');
    dispatch(decreaseStep());
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

  // console.log(eventTimeListDevideByDate);

  return (
    <>
      <TextAppBar onClick={handlePrevClick} text={'미팅시간 확정'} />
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
                {`${possibleUsersAll.length + declineNum}명 참여중`}
                <ArrowRightIcon />
              </div>
            </div>
          </div>
          <div className={'time-select-with-schedule'}>
            <div className={'time-line-line'} />
            {Object.keys(eventTimeListDevideByDate).map((dateKey) => (
              <div key={dateKey} className={'time-select-date'}>
                <div className={'time-select-date-grid'}>
                  <div className={'time-select-date-part'}>
                    <div className={'time-line-circle'} />
                    {dateKey}
                  </div>
                </div>
                {eventTimeListDevideByDate[dateKey].map(
                  ({ eventStartsAt, possibleNum }) => (
                    <div
                      key={dateKey + eventStartsAt.toISOString()}
                      className={'time-select-card-grid'}
                    >
                      <TimeCard
                        isEmpty={false}
                        isSelected={selectedTime === eventStartsAt.getTime()}
                        onClick={() => handleEventTimeClick(eventStartsAt)}
                        timeRange={getTimeRange(
                          eventStartsAt,
                          eventTimeDuration
                        )}
                        possibleNum={possibleNum}
                      />
                      <ScheduleCard isEmpty={true} />
                    </div>
                  )
                )}
              </div>
            ))}
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
    </>
  );
}

export default TimeConfirmator;
