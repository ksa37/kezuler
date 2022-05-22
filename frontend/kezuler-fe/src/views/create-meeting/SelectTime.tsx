import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import TimeOptions from 'src/constants/TimeOptions';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

import CalendarView from 'src/components/CalendarView';
import BlackButton from 'src/components/common/BlackButton';
function SelectTime() {
  const dispatch = useDispatch<AppDispatch>();
  // const { step } = useSelector((state: RootState) => state.createMeeting);
  const { increaseStep, decreaseStep } = createMeetingActions;
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handlePrevClick = () => {
    dispatch(decreaseStep());
  };

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  return (
    <div>
      <CalendarView />
      <Stack direction="row" spacing={1}>
        {TimeOptions.map((timeOption) => (
          <Chip
            key={timeOption}
            label={timeOption}
            variant="outlined"
            onClick={handleClick}
          />
        ))}
      </Stack>
      <BlackButton onClick={handleNextClick} text="다음" />
    </div>
  );
}

export default SelectTime;
