import React, { useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import classNames from 'classnames';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import TimeOptions from '../../constants/TimeOptions';
import { MEETING_LENGTH_LIST } from 'src/constants/CreateMeeting';
import PathName from 'src/constants/PathName';
import { CREATE_MEETING_NOTI_DISABLE_KEY } from 'src/constants/Popup';
import { useNoti } from 'src/hooks/useDialog';
// import { CREATE_CALENDAR_POPUP_DISABLE_KEY } from 'src/constants/Popup';
import { RootState } from '../../reducers';
import { createMeetingActions } from '../../reducers/CreateMeeting';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from '../../store';
import { setMindate } from 'src/utils/dateParser';
import getTimezoneDate, { getUTCDate } from 'src/utils/getTimezoneDate';

import BottomButton from '../../components/common/BottomButton';
import CalendarView from '../../components/create-meeting/CalendarView';
import KezulerDropdown from 'src/components/common/KezulerDropdown';

// import CalendarPopup from 'src/components/create-meeting/CalendarPopup';
// import ScheduleList from 'src/components/create-meeting/ScheduleList';
import { ReactComponent as CalendarIcon } from 'src/assets/calendar_icon.svg';
import { ReactComponent as ClockIcon } from 'src/assets/clock_icon.svg';
import { ReactComponent as ClockOrangeIcon } from 'src/assets/icn_clock_o20.svg';
import { ReactComponent as ArrowDownIcon } from 'src/assets/icn_dn_outline.svg';

function CalendarTimeSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventTimeList, fixedCreate } = useSelector(
    (state: RootState) => state.createMeeting
  );
  const { addTimeList, deleteTimeList, setEventTimeDuration } =
    createMeetingActions;

  const [startDate, setStartDate] = useState<Date | null>(setMindate());
  const { show } = alertAction;

  const navigate = useNavigate();
  const dateStr = useMemo(
    () =>
      startDate ? (
        <div>
          <b>{format(startDate, 'M월 d일 ', { locale: ko })}</b>
          {format(startDate, 'EEE', { locale: ko })}
        </div>
      ) : (
        <div>{''}</div>
      ),
    [startDate]
  );

  const eventTimeListDateToHighlight = useMemo(
    () =>
      eventTimeList.map((timeStamp) =>
        getTimezoneDate(new Date(timeStamp).getTime())
      ),
    [eventTimeList]
  );

  const createDate = (timeOption: string) => {
    if (startDate) {
      return getUTCDate(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          Number(timeOption.split(':')[0]),
          Number(timeOption.split(':')[1])
        )
      ).getTime();
    } else {
      return getTimezoneDate(new Date().getTime()).getTime();
    }
  };

  const { openNoti } = useNoti();

  const handleCloseNoti = () => {
    localStorage.setItem(CREATE_MEETING_NOTI_DISABLE_KEY, 'true');
  };

  const checkNotiDisable = () => {
    return localStorage.getItem(CREATE_MEETING_NOTI_DISABLE_KEY) === 'true';
  };

  const [notiPopped, setNotiPopped] = useState(checkNotiDisable());

  const handleChipClick = (timeOption: string) => {
    if (startDate) {
      const dateToAdd = createDate(timeOption);
      if (eventTimeList.includes(dateToAdd)) {
        dispatch(deleteTimeList(dateToAdd));
      } else {
        //정해진 일정 생성시
        if (fixedCreate) {
          if (eventTimeList.length === 0) {
            dispatch(addTimeList(dateToAdd));
          } else {
            dispatch(
              show({
                title: '1개의 일정을 선택해주세요.',
              })
            );
          }
          return;
        }
        //일정 투표 생성시
        if (eventTimeList.length === 0 && !notiPopped) {
          setNotiPopped(true);
          openNoti({
            title: `미팅 투표 생성 기능`,
            onConfirm: () => {
              dispatch(addTimeList(dateToAdd));
            },
            onCancel: handleCloseNoti,
          });
        } else if (eventTimeList.length === 10) {
          dispatch(
            show({
              title: '10개 옵션까지만 선택이 가능합니다.',
            })
          );
        } else {
          dispatch(addTimeList(dateToAdd));
        }
      }
    }
  };

  const handleNextClick = () => {
    navigate(PathName.createCheck);
  };

  // eventTimeDuration Index: 30, 60, 120
  const [selectedLengthIdx, setSelectedLengthIdx] = useState(1);
  // eventTimeDuration state 설정
  useMemo(() => {
    dispatch(
      setEventTimeDuration(MEETING_LENGTH_LIST[selectedLengthIdx].minutes)
    );
  }, [MEETING_LENGTH_LIST[selectedLengthIdx].minutes]);

  // Time Option Chip Focus 설정
  const setChipFocus = (startTimeStr: string) => {
    const focusChip = document.getElementById(startTimeStr);

    focusChip?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'start',
    });
  };

  useEffect(() => {
    let startTimeStr = '08:00';
    if (
      startDate &&
      TimeOptions(startDate).length > 0 &&
      Number(TimeOptions(startDate)[0].split(':')[0]) > 8
    ) {
      startTimeStr = TimeOptions(startDate)[0];
    }
    setChipFocus(startTimeStr);
  }, [startDate]);

  const getChips = useMemo(
    () =>
      startDate &&
      TimeOptions(startDate).map((timeOption) => {
        const included = eventTimeList.includes(createDate(timeOption));
        return (
          <div
            key={startDate?.getTime() + timeOption}
            id={timeOption}
            className={classNames('time-chips', {
              filled: included,
              blank: !included,
            })}
            onClick={() => handleChipClick(timeOption)}
          >
            <div className={'text'}>{timeOption}</div>
          </div>
        );
      }),
    [startDate, eventTimeList]
  );

  return (
    <div className={'create-wrapper'}>
      <div className={'padding-wrapper'}>
        <div className={'duration-selector'}>
          <ClockOrangeIcon className={'icn-clock-o20'} />
          <div className={'duration-text'}>미팅 길이</div>
          <KezulerDropdown
            buttonClassName={'duration-dropdown'}
            menuData={MEETING_LENGTH_LIST}
            displayKey={'display'}
            selectedIdx={selectedLengthIdx}
            setSelectedIdx={setSelectedLengthIdx}
            endIcon={<ArrowDownIcon />}
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
        <div className={'time-chip-text'}>
          <ClockIcon className={'icn-clock-b20'} />
          {fixedCreate ? (
            <>
              <b>{'미팅 시작 시간'}</b>
              {'을 선택해주세요'}
            </>
          ) : eventTimeList.length === 0 ? (
            <>
              {'미팅 시작을'}
              <b>{' 여러 개'}</b>
              {' 선택할 수 있어요.'}
            </>
          ) : (
            <>
              {'미팅 시작 선택중'}
              <b>{` ${eventTimeList.length}/10`}</b>
            </>
          )}
        </div>
        <Stack
          direction="row"
          spacing={'6px'}
          className={classNames('time-chips-stack', {
            'is-mobile': isMobile,
          })}
        >
          {getChips}
        </Stack>
      </div>
      <BottomButton
        onClick={handleNextClick}
        subtext={
          fixedCreate
            ? undefined
            : eventTimeList.length !== 0
            ? `${eventTimeList.length}개 시간 선택중(최대 10개)`
            : undefined
        }
        text="다음"
        disabled={eventTimeList.length === 0}
      />
    </div>
  );
}

export default CalendarTimeSelector;
