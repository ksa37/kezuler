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
import BottomButton from '../../components/common/BottomButton';

function CalendarTimeSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventTimeList } = useSelector(
    (state: RootState) => state.createMeeting
  );
  const { increaseStep, addTimeList, deleteTimeList } = createMeetingActions;

  // const timeChipSelectDescription = '미팅시작 시간을 선택하세요';

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
    const dateFnsStr = startDate ? (
      <div>
        <b>{format(startDate, 'M/d ', { locale: ko })}</b>
        {format(startDate, 'EEE', { locale: ko })}
      </div>
    ) : (
      <div>{''}</div>
    );
    return dateFnsStr;
  };

  const dateStr = useMemo(() => setDateString(startDate), [startDate]);

  const eventTimeListDateToHighlight = useMemo(
    () => eventTimeList.map((dateString) => new Date(dateString)),
    [eventTimeList]
  );

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  return (
    <div>
      <div className={'calendar'}>
        <CalendarView
          startDate={startDate}
          setStartDate={setStartDate}
          highlightDates={eventTimeListDateToHighlight}
        />
      </div>
      <div className={'date-string'}>{dateStr}</div>
      <div className={'time-chip-text'}>
        <b>{'미팅시작 시각'}</b>
        {'을 선택하세요'}
      </div>
      <Stack
        direction="row"
        spacing={1}
        style={{ overflow: 'auto' }}
        className={'time-chips-stack'}
      >
        {TimeOptions.map((timeOption) =>
          eventTimeList.includes(createDate(timeOption)) ? (
            <Chip
              key={timeOption}
              label={timeOption}
              variant="filled"
              className={'time-chips'}
              sx={{ backgroundColor: '#282F39', color: '#FFFFFF' }}
              onClick={() => handleChipClick(timeOption)}
            />
          ) : (
            <Chip
              key={timeOption}
              label={timeOption}
              variant="outlined"
              className={'time-chips'}
              sx={{ backgroundColor: 'white' }}
              onClick={() => handleChipClick(timeOption)}
            />
          )
        )}
      </Stack>
      <BottomButton onClick={handleNextClick} text="다음" />
    </div>
  );
}

export default CalendarTimeSelector;
