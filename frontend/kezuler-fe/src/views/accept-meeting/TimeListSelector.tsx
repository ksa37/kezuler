import React, { ChangeEvent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  TextField,
} from '@mui/material';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import BotomButton from 'src/components/common/BottomButton';

import { ReactComponent as CheckedIcon } from 'src/assets/icon_checked.svg';
import { ReactComponent as NotCheckedIcon } from 'src/assets/icon_not_checked.svg';
import { ReactComponent as ProfileIcon } from 'src/assets/icon_profile.svg';
import { ReactComponent as ProfilesIcon } from 'src/assets/icon_profiles.svg';

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
  const notAvailableDescription = '가능한 시간이 없어요';
  const allAvailableDescription = '모든 시간 가능해요';
  const notAvailableReasonDescription =
    '시간이 안되는 이유 또는 가능한 시간을 미팅 호스트에 알려주세요.(선택사항, 100자 이내)';

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  const handleNotAvailableClick = () => {
    dispatch(setIsDecline(!isDecline));
  };

  const handleAllAvailableClick = () => {
    if (isDecline) dispatch(setIsDecline(!isDecline));
    console.log('hi');
  };

  const handleDeclineReasonChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setDeclineReason(event.target.value));
  };

  const handleEventTimeClick = () => {
    console.log('hi');
  };

  const userIds = eventTimeCandidates.reduce<string[]>(
    (prev, eventTimeCandidate) => {
      const useIdsInDay2 = Object.values(eventTimeCandidate).reduce<string[]>(
        (prev, eventTime) => {
          const userIdsInDay = eventTime.reduce<string[]>((prev, et) => {
            const userIds = et.possibleUsers.map((u) => u.userId);
            return prev.concat(userIds.filter((id) => prev.indexOf(id) < 0));
          }, []);

          return prev.concat(userIdsInDay.filter((id) => prev.indexOf(id) < 0));
        },
        []
      );
      return prev.concat(useIdsInDay2.filter((id) => prev.indexOf(id) < 0));
    },
    []
  );

  console.log(userIds);
  const optionsNum = useMemo(
    () =>
      eventTimeCandidates.reduce(function (acc, currentDate) {
        const currentDateKey = Object.keys(currentDate);
        let eventTimesNum = 0;
        if (currentDateKey.length !== 1) {
          console.log('Warning: Time candidate record has more than one key');
        } else {
          eventTimesNum = currentDate[currentDateKey[0]].length;
        }
        return acc + eventTimesNum;
      }, 0),
    [eventTimeCandidates]
  );
  console.log(optionsNum);

  const isSelected = useMemo(() => availableTimes.length > 0, [availableTimes]);

  const btnGroupStyles = {
    '& 	.MuiButtonGroup-root': {
      width: '100%',
    },
    '& .MuiButton-root': {
      border: '0.5px solid #282f39',
      borderRadius: '8px',
      boxShadow: '0px 15px 35px #282f391a',
      fontSize: '16px',
      height: '48px',
      width: '45%',
      '& .hover': '#FAD94F',
    },
    '& .MuiButton-text': {
      color: '#282F39',
    },
    '& .MuiButton-contained': {
      backgroundColor: '#FAD94F',
      color: '#282F39',
    },
    '& .MuiButton-outlined': {
      backgroundColor: '#FFFFFF',
      color: '#282F39',
    },
  };

  return (
    <div className={'time-list-selector'}>
      <div className={'description-text'}>
        {'참여 가능한 시간을'}
        <br />
        {'선택해주세요'}
      </div>
      <div className={'time-list-selector-personnel'}>
        <ProfilesIcon />
        {`${userIds.length}명 참여중`}
      </div>
      <div className={classNames('time-select-grid-container')}>
        {eventTimeCandidates.map((eventTimeCandidate) =>
          Object.keys(eventTimeCandidate).map((dateKey) => (
            <div key={dateKey} className={'time-select-date'}>
              <div className={'timelineLine'}></div>
              <div>
                <div className={'timelineCircle'}></div>
                {dateKey}
              </div>
              {eventTimeCandidate[dateKey].map((eventTimeWithUser) => (
                <div
                  key={dateKey + eventTimeWithUser.eventStartsAt}
                  className={'time-select-time-card'}
                  onClick={handleEventTimeClick}
                >
                  {/* {isChecked ? <CheckedIcon /> : <NotCheckedIcon />} */}

                  <div className={'time-select-time-content'}>
                    <span className={'check-box-icon'}>
                      <NotCheckedIcon />
                    </span>
                    <span>{eventTimeWithUser.eventStartsAt}</span>
                    <span>
                      <ProfileIcon />
                      {eventTimeWithUser.possibleUsers.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      <div className={'calendar-pair-ask'}>
        <div className={'calendar-pair-ask-txt'}>
          {'캘린더 일정을'}
          <br />
          {'불러오세요'}
        </div>
        <div className={'calendar-pair-ask-btn'}>일정 불러오기</div>
      </div>
      <div className={'available-option-btn-group'}>
        <ButtonGroup disableElevation sx={btnGroupStyles}>
          <Button
            variant={isDecline ? 'contained' : 'outlined'}
            onClick={handleNotAvailableClick}
            className={'not-available-btn'}
          >
            <b>{notAvailableDescription}</b>
          </Button>
          <Button
            variant="contained"
            onClick={handleAllAvailableClick}
            className={'all-available-btn'}
          >
            <b>{allAvailableDescription}</b>
          </Button>
        </ButtonGroup>
        {isDecline && (
          <TextField
            label={notAvailableReasonDescription}
            value={declineReason}
            onChange={handleDeclineReasonChange}
          />
        )}
      </div>

      {isSelected ? (
        <BotomButton text={'선택 완료'} onClick={handleNextClick} />
      ) : (
        <BotomButton
          text={'시간을 선택해주세요'}
          onClick={handleNextClick}
          disabled={true}
        />
      )}
    </div>
  );
}

export default TimeListSelector;
