import React, { ChangeEvent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Paper,
  TextField,
} from '@mui/material';

import { AcceptMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import BotomButton from 'src/components/common/BottomButton';
import ProgressBar from 'src/components/ProgressBar';

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

  return (
    <>
      <h2>
        {timeSelectDescription}
        {/* <span>{`${selectedOptionsNum}/${selectableOptionsNum}`}</span> */}
        {`${userIds.length}명 참여중`}
      </h2>
      {eventTimeCandidates.map((eventTimeCandidate) =>
        Object.keys(eventTimeCandidate).map((dateKey) => (
          <div key={dateKey}>
            <h5>{dateKey}</h5>
            {eventTimeCandidate[dateKey].map((eventTimeWithUser) => (
              <Button
                key={dateKey + eventTimeWithUser.eventStartsAt}
                // startIcon={}
                onClick={handleEventTimeClick}
              >
                <Card>
                  <CardContent>{eventTimeWithUser.eventStartsAt}</CardContent>
                  {eventTimeWithUser.possibleUsers.length}
                </Card>
              </Button>
            ))}
          </div>
        ))
      )}

      <ButtonGroup disableElevation>
        <Button
          variant={isDecline ? 'contained' : 'outlined'}
          onClick={handleNotAvailableClick}
        >
          {notAvailableDescription}
        </Button>
        <Button variant="contained" onClick={handleAllAvailableClick}>
          {allAvailableDescription}
        </Button>
      </ButtonGroup>
      {isDecline && (
        <TextField
          label={notAvailableReasonDescription}
          value={declineReason}
          onChange={handleDeclineReasonChange}
        />
      )}

      {isSelected ? (
        <BotomButton text={'선택 완료'} onClick={handleNextClick} />
      ) : (
        <BotomButton
          text={'시간을 선택해주세요'}
          onClick={handleNextClick}
          disabled={true}
        />
      )}
    </>
  );
}

export default TimeListSelector;
