import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import classNames from 'classnames';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import TimeOptions from '../../constants/TimeOptions';
import { MEETING_LENGTH_LIST } from 'src/constants/CreateMeeting';
import { RootState } from '../../reducers';
import { createMeetingActions } from '../../reducers/CreateMeeting';
import { AppDispatch } from '../../store';

import CalendarView from '../../components/CalendarView';
import BottomButton from '../../components/common/BottomButton';
import KezulerDropdown from 'src/components/common/KezulerDropdown';

import { ReactComponent as CalendarIcon } from 'src/assets/calendar_icon.svg';
import { ReactComponent as ClockIcon } from 'src/assets/clock_icon.svg';
import { ReactComponent as GoogleIcon } from 'src/assets/google_icon.svg';
import { ReactComponent as ClockOrangeIcon } from 'src/assets/icn_clock_o20.svg';
import { ReactComponent as ArrowDownIcon } from 'src/assets/icn_dn_outline.svg';

function CalendarTimeSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventTimeList } = useSelector(
    (state: RootState) => state.createMeeting
  );
  const { increaseStep, addTimeList, deleteTimeList } = createMeetingActions;

  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const createDate = (timeOption: string) => {
    if (startDate) {
      return new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        Number(timeOption.split(':')[0]),
        Number(timeOption.split(':')[1])
      ).toISOString();
    } else {
      console.log('Warning: date is null!');
      return new Date().toISOString();
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

  const handleChipClick = (timeOption: string) => {
    if (startDate) {
      const dateToAdd = createDate(timeOption);
      console.log(dateToAdd);
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

  const [selectedLengthIdx, setSelectedLengthIdx] = useState(0);
  // MEETING_LENGTH_LIST[selectedLengthIdx].minutes
  return (
    <div>
      <div className={'duration-selector-margin'} />
      <div className={'duration-selector'}>
        <ClockOrangeIcon className={'icn-clock-o20'} />
        <div className={'duration-text'}>미팅 길이</div>
        <KezulerDropdown
          endIcon={<ArrowDownIcon />}
          menuData={MEETING_LENGTH_LIST}
          displayKey={'display'}
          selectedIdx={selectedLengthIdx}
          setSelectedIdx={setSelectedLengthIdx}
          buttonClassName={'duration-dropdown'}
        />
      </div>
      <div className={'calendar'}>
        <CalendarView
          startDate={startDate}
          setStartDate={setStartDate}
          highlightDates={eventTimeListDateToHighlight}
        />
      </div>
      <div className={'date-string'}>
        <CalendarIcon className={'calendar-icon'} />
        <div className={'date-string-text'}>{dateStr}</div>
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
        <ClockIcon className={'icn-clock-b20'} />
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
        subtext={
          eventTimeList.length !== 0
            ? `${eventTimeList.length}개 시간 선택중(최대 5개)`
            : undefined
        }
        text="다음"
        disabled={eventTimeList.length === 0}
      />
    </div>
  );
}

export default CalendarTimeSelector;
