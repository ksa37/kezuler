import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import classNames from 'classnames';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

import BottomButton from 'src/components/common/BottomButton';

type EventTimeListDate = { [date: string]: string[] };

function ShowSelectedOptions() {
  const dispatch = useDispatch<AppDispatch>();
  const { increaseStep, deleteTimeList } = createMeetingActions;
  const { eventTimeList, eventTimeDuration } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const eventTimeListDevideByDate = useMemo(() => {
    console.log(eventTimeList);
    const eventTimeListDate = eventTimeList.map(
      (dateString) => new Date(dateString)
    );
    // console.log(eventTimeListDate);
    const eventTimeListDateWithObj: EventTimeListDate = {};
    for (let i = 0; i < eventTimeListDate.length; i++) {
      const dateWithoutTimeArr = eventTimeListDate[i]
        .toLocaleString('ko-KR')
        .split('. ');
      console.log(dateWithoutTimeArr);
      // dateWithoutTimeArr[1] = dateWithoutTimeArr[1];
      // dateWithoutTimeArr[2] = dateWithoutTimeArr[2];
      dateWithoutTimeArr[3] = ''.concat(
        ...dateWithoutTimeArr[3].split(':').slice(0, 1),
        ':',
        ...dateWithoutTimeArr[3].split(':').slice(1, 2)
      );

      // const dateWithoutTime = ''.concat(...dateWithoutTimeArr.slice(1,2) );
      // format(eventTimeListDate[i], 'M/d EEE ', { locale: ko });
      const dateWithoutTime = ''.concat(
        ...dateWithoutTimeArr.slice(1, 2),
        '/',
        ...dateWithoutTimeArr.slice(2, 3)
      );

      if (!eventTimeListDateWithObj[dateWithoutTime]) {
        eventTimeListDateWithObj[dateWithoutTime] = [];
      }
      eventTimeListDateWithObj[dateWithoutTime].push(
        ''.concat(...dateWithoutTimeArr.slice(3))
      );
    }
    return eventTimeListDateWithObj;
  }, [eventTimeList]);

  console.log(eventTimeListDevideByDate);

  const subDescription = `총 ${eventTimeList.length}개 선택`;

  const handleDeleteClick = (dateKey: string, time: string) => {
    const amPm = time.split(' ')[0] === '오전';
    const hour: string = time.split(' ')[1].split(':')[0];
    const minute: string = time.split(' ')[1].split(':')[1];
    const dateStrToDelete = new Date(
      Number(dateKey.slice(0, 4)),
      Number(dateKey.slice(4, 6)) - 1,
      Number(dateKey.slice(6, 8)),
      amPm ? Number(hour) : Number(hour) + 12,
      Number(minute)
    ).toISOString();
    console.log(dateStrToDelete);
    dispatch(deleteTimeList(dateStrToDelete));
  };

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  return (
    <div>
      <div className={'description-text'}>
        {'선택한 날짜와 시간을'}
        <br />
        {'확인해주세요'}
      </div>
      <div className={'selected-num'}>{subDescription}</div>
      <div>
        {Object.keys(eventTimeListDevideByDate).map((dateKey) => (
          <div key={dateKey}>
            <div className={'timelineLine'}></div>
            <div>
              <div className={'timelineCircle'}></div>
              {dateKey}
            </div>
            {eventTimeListDevideByDate[dateKey].map((time) => (
              <div key={dateKey + time}>
                <div>
                  {time}
                  <Button onClick={() => handleDeleteClick(dateKey, time)}>
                    X
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <BottomButton onClick={handleNextClick} text="다음" />
    </div>
  );
}

export default ShowSelectedOptions;
