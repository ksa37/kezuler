import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import TimeOptions from '../../constants/TimeOptions';
import { RootState } from '../../reducers';
import { createMeetingActions } from '../../reducers/CreateMeeting';
import { AppDispatch } from '../../store';

import CalendarView from '../../components/CalendarView';
import BlackButton from '../../components/common/BlackButton';
import ProgressBar from 'src/components/ProgressBar';

function CalendarTimeSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventTimeList } = useSelector(
    (state: RootState) => state.createMeeting
  );
  const { increaseStep, decreaseStep, addTimeList, deleteTimeList } =
    createMeetingActions;

  const timeSelectDescription = '원하는 미팅 시간을 선택해주세요';
  const timeChipSelectDescription = '미팅시작 시간';

  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const createDate = (timeOption: string) => {
    if (startDate)
      return new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        Number(timeOption.split(':')[0]),
        Number(timeOption.split(':')[1])
      ).toISOString();
    else {
      console.log('Warning: date is null!');
      return new Date().toISOString();
    }
  };

  const handleChipClick = (timeOption: string) => {
    if (startDate) {
      const dateToAdd = createDate(timeOption);
      if (eventTimeList.includes(dateToAdd)) {
        dispatch(deleteTimeList(dateToAdd));
        console.log('Deleted Date !', dateToAdd);
      } else {
        if (eventTimeList.length === 5) {
          alert('5개까지만 추가할 수 있어요!');
        } else {
          dispatch(addTimeList(dateToAdd));
          console.log('Added Date !', dateToAdd);
        }
      }
    } else {
      console.log('Warning: date is null!');
    }
  };

  const setDateString = (startDate: Date | null) => {
    const dateFnsStr = startDate
      ? format(startDate, 'MM월 dd일 EEE', { locale: ko })
      : '';
    const dateStr =
      dateFnsStr.slice(0, 1) === '0' ? dateFnsStr.slice(1) : dateFnsStr;
    return dateStr;
  };

  const dateStr = useMemo(() => setDateString(startDate), [startDate]);

  const eventTimeListDateToHighlight = useMemo(
    () => eventTimeList.map((dateString) => new Date(dateString)),
    [eventTimeList]
  );

  const handlePrevClick = () => {
    dispatch(decreaseStep());
  };

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  return (
    <div>
      <h1>{timeSelectDescription}</h1>
      <CalendarView
        startDate={startDate}
        setStartDate={setStartDate}
        highlightDates={eventTimeListDateToHighlight}
      />
      <h5>{dateStr}</h5>
      <h3>{timeChipSelectDescription}</h3>
      <Stack direction="row" spacing={1} style={{ overflow: 'auto' }}>
        {TimeOptions.map((timeOption) =>
          eventTimeList.includes(createDate(timeOption)) ? (
            <Chip
              key={timeOption}
              label={timeOption}
              variant="filled"
              onClick={() => handleChipClick(timeOption)}
            />
          ) : (
            <Chip
              key={timeOption}
              label={timeOption}
              variant="outlined"
              onClick={() => handleChipClick(timeOption)}
            />
          )
        )}
      </Stack>
      <BlackButton onClick={handleNextClick} text="다음" />
    </div>
  );
}

export default CalendarTimeSelector;
