import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import { getTimeListDevideByDate, getTimeRange } from 'src/utils/dateParser';

import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as DeleteIcon } from 'src/assets/icn_trash.svg';

function ShowSelectedOptions() {
  const dispatch = useDispatch<AppDispatch>();
  const { increaseStep, deleteTimeList } = createMeetingActions;
  const { eventTimeList, eventTimeDuration } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const eventTimeListDevideByDate = useMemo(
    () =>
      getTimeListDevideByDate(
        eventTimeList.map((dateStr) => new Date(dateStr))
      ),
    [eventTimeList]
  );

  const subDescription = `총 ${eventTimeList.length}개 선택`;

  const handleDeleteClick = (dateKey: string, time: Date) => {
    dispatch(deleteTimeList(time.toISOString()));
  };

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  return (
    <div className={'time-list-selector'}>
      <div className={'time-list-top'}>
        <div className={'time-list-top-description'}>
          {'선택한 날짜와 시간을'}
          <br />
          {'확인해주세요'}
        </div>
        <div className={'time-list-selector-personnel'}>{subDescription}</div>
      </div>
      <div className={'time-select-with-schedule'}>
        <div className={'time-line-line'} />
        {Object.keys(eventTimeListDevideByDate).map((dateKey) => (
          <div key={dateKey} className={'time-select-date'}>
            <div className={'time-select-date-grid'}>
              <div className={'time-select-date-part'}>
                <div className={'time-line-circle'} />
                {dateKey}
              </div>
            </div>
            {eventTimeListDevideByDate[dateKey].map((time) => (
              <div key={dateKey + time} className={'time-select-card-grid'}>
                <div className={'time-select-time-card'}>
                  <div className={'time-select-time-content'}>
                    {getTimeRange(time, eventTimeDuration)}
                  </div>
                  <div
                    className="check-box-icon"
                    onClick={() => handleDeleteClick(dateKey, time)}
                  >
                    <DeleteIcon />
                  </div>
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
