import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import TimeOptions from '../../constants/TimeOptions';
import { RootState } from '../../reducers';
import { createMeetingActions } from '../../reducers/CreateMeeting';
import { AppDispatch } from '../../store/store';

import BlackButton from '../../components/BlackButton';
import CalendarView from '../../components/CalendarView';
function CalendarTimeSelector() {
  const dispatch = useDispatch<AppDispatch>();
  // const { step } = useSelector((state: RootState) => state.createMeeting);
  const { increaseStep, decreaseStep, addTimeList } = createMeetingActions;

  const timeSelectDescription = '원하는 미팅 시간을 선택해주세요';
  const timeChipSelectDescription = '미팅시작 시간';

  const handleClick = (timeOption: string) => {
    if (startDate) {
      const dateToAdd = new Date(
        startDate.getFullYear(),
        startDate.getMonth() - 1,
        startDate.getDate(),
        Number(timeOption.split(':')[0]),
        Number(timeOption.split(':')[1])
      );
      dispatch(addTimeList(dateToAdd));
      console.log('Added Date !');
    } else {
      console.log('Warning: date is null!');
    }
  };

  const handlePrevClick = () => {
    dispatch(decreaseStep());
  };

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const setDateString = (startDate: Date | null) => {
    const dateFnsStr = startDate
      ? format(startDate, 'MM월 dd일 EEE', { locale: ko })
      : '';
    const dateStr =
      dateFnsStr.slice(0, 1) === '0' ? dateFnsStr.slice(1) : dateFnsStr;
    return dateStr;
  };

  const dateStr = useMemo(() => setDateString(startDate), [startDate]);

  if (startDate) {
    console.log(format(startDate, 'MM월 dd일 EEE', { locale: ko }));
  }

  return (
    <div>
      <h1>{timeSelectDescription}</h1>
      <CalendarView startDate={startDate} setStartDate={setStartDate} />
      <h5>{dateStr}</h5>
      <h3>{timeChipSelectDescription}</h3>
      <Stack direction="row" spacing={1}>
        {TimeOptions.map((timeOption) => (
          <Chip
            key={timeOption}
            label={timeOption}
            variant="outlined"
            onClick={() => handleClick(timeOption)}
          />
        ))}
      </Stack>
      <BlackButton onClick={handleNextClick} text="다음" />
    </div>
  );
}

export default CalendarTimeSelector;
