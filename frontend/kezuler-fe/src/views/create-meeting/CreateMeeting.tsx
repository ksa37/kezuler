import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import TimeOptions from '../../constants/TimeOptions';

import BlackButton from '../../components/BlackButton';
import CalendarView from '../../components/CalendarView';

function CreateMeeting() {
  const handleClick = () => {
    console.info('You clicked the Chip.');
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
      <BlackButton onClick={() => console.log('hello')} text="다음" />
    </div>
  );
}

export default CreateMeeting;
