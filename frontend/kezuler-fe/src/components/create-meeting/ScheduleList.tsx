import React from 'react';
import { Stack } from '@mui/material';

type Schedule = { title: string; time: string };
interface Props {
  schedules: Schedule[];
}

function ScheduleList({ schedules }: Props) {
  return (
    <Stack
      direction="column"
      spacing={'8px'}
      style={{ overflow: 'auto' }}
      className={'schedule-list'}
      sx={{ marginBlock: '8px' }}
    >
      <div className={'schedule-list-title'}>내 일정</div>
      {schedules.map((schedule) => (
        <div key={schedule.title} className={'schedule-list-content'}>
          <div className={'schedule-title'}>{schedule.title}</div>
          <div className={'schedule-time'}>{schedule.time}</div>
        </div>
      ))}
    </Stack>
  );
}

export default ScheduleList;
