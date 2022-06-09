import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

// import classNames from 'classnames';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import { getTimeListDevideByDate, getTimeRange } from 'src/utils/dateParser';

import BottomButton from 'src/components/common/BottomButton';

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
                  {getTimeRange(time, eventTimeDuration)}
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
