import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';
import { parseDateString } from 'src/utils/dateParser';

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
  const { pendingEvent, isDecline, declineReason, availableTimes } =
    useSelector((state: RootState) => state.acceptMeeting);
  const { increaseStep, decreaseStep, setIsDecline, setDeclineReason } =
    acceptMeetingActions;

  const {
    eventId,
    eventTitle,
    eventDescription,
    eventTimeDuration,
    declinedUsers,
    eventTimeCandidates,
    eventZoomAddress,
    eventPlace,
    eventAttachment,
  } = pendingEvent;

  // const selectableOptionsNum = 5;
  // const selectedOptionsNum = 0;

  const timeSelectDescription = '참여 가능한 시간을 선택해주세요';

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  const handleEventTimeClick = () => {
    console.log('hi');
  };

  const userIds = eventTimeCandidates.reduce<string[]>(
    (prev, eventTimeCandidate) => {
      const userIds = eventTimeCandidate.possibleUsers.map((u) => u.userId);
      return prev.concat(userIds.filter((id) => prev.indexOf(id) < 0));
    },
    []
  );

  const optionsNum = useMemo(
    () => eventTimeCandidates.length,
    [eventTimeCandidates]
  );
  console.log(optionsNum);

  const isSelected = useMemo(() => availableTimes.length > 0, [availableTimes]);

  return (
    <div className={'time-list-selector'}>
      <div className={'description-text'}>
        {'참여 가능한 시간을'}
        <br />
        {'선택해주세요'}
      </div>
      <div className={'time-list-selector-personnel'}>
        <CircleIcon className="icon-circle" />
        <ProfilesIcon className="icon-profiles" />
        {`${userIds.length}명 참여중`}
        <ArrowRightIcon />
      </div>
      <div className={classNames('time-select-grid-container')}>
        {eventTimeCandidates.map(({ eventStartsAt, possibleUsers }) => {
          const dateKey = parseDateString(eventStartsAt);

          return (
            <div key={dateKey} className={'time-select-date'}>
              <div className={'timelineLine'} />
              <div>
                <div className={'timelineCircle'} />
                {dateKey}
              </div>
              <div
                key={dateKey + eventStartsAt}
                className={'time-select-time-card'}
                onClick={handleEventTimeClick}
              >
                {/* {isChecked ? <CheckedIcon /> : <NotCheckedIcon />} */}

                <div className={'time-select-time-content'}>
                  <span className={'check-box-icon'}>
                    <NotCheckedIcon />
                  </span>
                  <span>{eventStartsAt}</span>
                  <span>
                    <ProfileIcon />
                    {possibleUsers.length}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={'calendar-pair-ask'}>
        <div className={'calendar-pair-ask-txt'}>
          {'캘린더 일정을'}
          <br />
          {'불러오세요'}
        </div>
        <div className={'calendar-pair-ask-btn'}>일정 불러오기</div>
      </div>
      <AvailableOptionSelector />
      <BottomButton
        text={isSelected ? '선택 완료' : '시간을 선택해주세요'}
        onClick={handleNextClick}
        disabled={!isSelected}
      />
    </div>
  );
}

export default TimeListSelector;
