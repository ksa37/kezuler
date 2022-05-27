import React, { ChangeEvent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Paper, TextField } from '@mui/material';

import { AcceptMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import BlackButton from 'src/components/common/BlackButton';
import ProgressBar from 'src/components/ProgressBar';

function TimeListSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent, isDecline, declineReason } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
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

  const selectableOptionsNum = 5;
  const selectedOptionsNum = 0;

  const timeSelectDescription = '참여 가능한 시간을 선택해주세요';
  const notAvailableDescription = '가능한 시간이 없어요';
  const allAvailableDescription = '모든 시간 가능해요';
  const notAvailableReasonDescription =
    '시간이 안되는 이유 또는 가능한 시간을 미팅 호스트에 알려주세요.(필수x)';

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  const handleNotAvailableClick = () => {
    dispatch(setIsDecline(!isDecline));
  };

  const handleAllAvailableClick = () => {
    console.log('hi');
  };

  const handleEventTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setDeclineReason(event.target.value));
  };

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

  return (
    <>
      <h2>
        {timeSelectDescription}
        <span>{`${selectedOptionsNum}/${selectableOptionsNum}`}</span>
      </h2>
      {/* {Object.keys(eventTimeListDevideByDate).map((dateKey) => (
        <div key={dateKey}>
          <h5>{dateKey}</h5>
          {eventTimeListDevideByDate[dateKey].map((time) => (
            <Card key={dateKey + time}>
              <CardContent>
                {time}
                <Button onClick={() => handleDeleteClick(dateKey, time)}>
                  X
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ))} */}
      <Paper elevation={0} square={true}>
        <ButtonGroup disableElevation>
          <Button variant="outlined" onClick={handleNotAvailableClick}>
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
            onChange={handleEventTitleChange}
          />
        )}
      </Paper>
      <BlackButton text={'선택 완료'} onClick={handleNextClick} />
    </>
  );
}

export default TimeListSelector;
