import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DriveEtaTwoTone } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import classNames from 'classnames';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import TimeOptions from '../../constants/TimeOptions';
import { RootState } from '../../reducers';
import { createMeetingActions } from '../../reducers/CreateMeeting';
import { AppDispatch } from '../../store';

import CalendarView from '../../components/CalendarView';
import BottomButton from '../../components/common/BottomButton';

import { ReactComponent as CalendarIcon } from 'src/assets/calendar_icon.svg';
import { ReactComponent as ClockIcon } from 'src/assets/clock_icon.svg';
import { ReactComponent as GoogleIcon } from 'src/assets/google_icon.svg';

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
        <b>{format(startDate, 'M월 d일 ', { locale: ko })}</b>
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

  const [popupDisable, setPopupDisable] = useState(false);

  const handleCalendarPopupNo = () => {
    console.log('no');
    setPopupDisable(true);
    //TODO
    //No라고 한 정보를 보관하기
  };

  const handleCalendarPopupYes = () => {
    console.log('yes');
    //TODO
    //캘린더 연동
  };

  return (
    <div>
      {/* <div className={'duration-selector'}>미팅길이</div> */}
      <div className={'calendar'}>
        <CalendarView
          startDate={startDate}
          setStartDate={setStartDate}
          highlightDates={eventTimeListDateToHighlight}
        />
      </div>
      <div className={'date-string'}>
        <CalendarIcon className={'left-icon'} />
        {dateStr}
      </div>

      {popupDisable && (
        <Stack
          direction="column"
          spacing={'8px'}
          style={{ overflow: 'auto' }}
          className={'schedule-list'}
          sx={{ marginBlock: '8px' }}
        >
          <div className={'schedule-list-title'}>내 일정</div>
          <div className={'schedule-list-content'}>
            <div className={'schedule-title'}>철수 저녁</div>
            <div className={'schedule-time'}>오전 7:00 ~ 오전 11:00</div>
          </div>
          <div className={'schedule-list-content'}>
            <div className={'schedule-title'}>동아리 모임</div>
            <div className={'schedule-time'}>오전 7:00 ~ 오전 11:00</div>
          </div>
          <div className={'schedule-list-content'}>
            <div className={'schedule-title'}>휴가</div>
            <div className={'schedule-time'}>하루종일</div>
          </div>
          <div className={'schedule-list-content'}>
            <div className={'schedule-title'}>휴가</div>
            <div className={'schedule-time'}>하루종일</div>
          </div>
        </Stack>
      )}

      <div className={'time-chip-text'}>
        <ClockIcon className={'left-icon'} />
        <b>{'미팅시작 시각'}</b>
        {'을 선택하세요'}
      </div>
      <Stack
        direction="row"
        spacing={'6px'}
        style={{ overflow: 'auto' }}
        sx={{ marginInline: '12px' }}
        className={'time-chips-stack'}
      >
        {TimeOptions.map((timeOption) =>
          eventTimeList.includes(createDate(timeOption)) ? (
            <div
              key={timeOption}
              className={classNames('time-chips', 'filled')}
              onClick={() => handleChipClick(timeOption)}
            >
              <div className={'text'}>{timeOption}</div>
            </div>
          ) : (
            <div
              key={timeOption}
              className={classNames('time-chips', 'blank')}
              onClick={() => handleChipClick(timeOption)}
            >
              <div className={'text'}>{timeOption}</div>
            </div>
          )
        )}
      </Stack>
      {!popupDisable && (
        <div className={'calendar-popup'}>
          <div className={'description'}>
            <GoogleIcon className={'google-icon'} />
            {'혜민'}
            {'님의 '}
            <b>{'구글계정 일정'}</b>
            {'도 불러올까요?'}
            <br />
            {'미팅시간 결정에 도움이 될 거에요!'}
          </div>
          <div className={'popup-options'}>
            <span className={'no'} onClick={handleCalendarPopupNo}>
              {'다음에 할게요'}
            </span>
            <span className={'yes'} onClick={handleCalendarPopupYes}>
              {'좋아요'}
            </span>
          </div>
        </div>
      )}
      <BottomButton
        onClick={handleNextClick}
        text="다음"
        disabled={eventTimeList.length === 0}
      />
    </div>
  );
}

export default CalendarTimeSelector;
