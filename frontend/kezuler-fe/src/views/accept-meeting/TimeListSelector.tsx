import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';
import {
  getTimeListDevideByDateWithPossibleNum,
  getTimeRange,
} from 'src/utils/dateParser';

import AvailableOptionSelector from 'src/components/accept-meeting/AvailableOptionSelector';
import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as ArrowRightIcon } from 'src/assets/arrow_right.svg';
import { ReactComponent as CheckedIcon } from 'src/assets/icn_checked.svg';
import { ReactComponent as NotCheckedIcon } from 'src/assets/icon_not_checked.svg';
import { ReactComponent as ProfileIcon } from 'src/assets/icon_profile.svg';
import { ReactComponent as ProfilesIcon } from 'src/assets/icon_profiles.svg';
import { ReactComponent as CircleIcon } from 'src/assets/icon_profiles_circle.svg';

function TimeListSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent, availableTimes } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { increaseStep, addAvailableTimes, deleteAvailableTimes } =
    acceptMeetingActions;

  const { eventTimeDuration, declinedUsers, eventTimeCandidates } =
    pendingEvent;

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  const handleEventTimeClick = (eventStartsAt: Date) => {
    const dateToAdd = eventStartsAt.toISOString();
    console.log(dateToAdd);
    if (availableTimes.includes(dateToAdd)) {
      dispatch(deleteAvailableTimes(dateToAdd));
      console.log('Deleted Date !', dateToAdd);
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

  // const isSelected = useMemo(() => availableTimes.length > 0, [availableTimes]);

  return (
    <div className={'time-list-selector'}>
      <div className={'description-text'}>
        {'참여 가능한 시간을'}
        <br />
        {'모두 선택해주세요'}
      </div>
      <div className={'time-list-selector-personnel'}>
        <CircleIcon className="icon-circle" />
        <ProfilesIcon className="icon-profiles" />
        {`${possibleUsersAll.length + declineNum}명 참여중`}
        <ArrowRightIcon />
      </div>
      <div className={classNames('time-select-grid-container')}>
        {Object.keys(eventTimeListDevideByDate).map((dateKey) => (
          <div key={dateKey} className={'time-select-date'}>
            <div className={'timelineLine'} />
            <div>
              <div className={'timelineCircle'} />
              {dateKey}
            </div>
            {eventTimeListDevideByDate[dateKey].map(
              ({ eventStartsAt, possibleNum }) => (
                <div
                  key={eventStartsAt.toTimeString()}
                  className={'time-select-time-card'}
                  onClick={() => handleEventTimeClick(eventStartsAt)}
                >
                  <div className={'time-select-time-content'}>
                    <div className={'time-range'}>
                      {getTimeRange(eventStartsAt, eventTimeDuration)}
                    </div>
                    <div>
                      <ProfileIcon />
                    </div>
                    <div>{possibleNum}</div>
                  </div>
                  <div className="check-box-icon">
                    {availableTimes.includes(eventStartsAt.toISOString()) ? (
                      <CheckedIcon />
                    ) : (
                      <NotCheckedIcon />
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
      <div className={'calendar-pair-ask'}>
        <div className={'calendar-pair-ask-txt'}>
          {'캘린더를 연동하여'}
          <br />
          {'이중약속을 방지해요!'}
        </div>
        <div className={'calendar-pair-ask-btn'}>
          <div className={'btn-txt'}>나의 일정 </div>
          <div className={'btn-txt'}>불러오기</div>
          {/* <br /> */}
        </div>
      </div>
      <AvailableOptionSelector />
      <BottomButton
        text={'선택 완료'}
        onClick={handleNextClick}
        // disabled={!isSelected}
      />
    </div>
  );
}

export default TimeListSelector;
