import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';

import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { dialogAction } from 'src/reducers/dialog';
import { AppDispatch } from 'src/store';
import { getTimeListDevideByDate, getTimeRange } from 'src/utils/dateParser';
import getTimezoneDate from 'src/utils/getTimezoneDate';

import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as DeleteIcon } from 'src/assets/icn_trash.svg';
import 'src/styles/common/TimeLineGrid.scss';

function SelectedOptions() {
  const dispatch = useDispatch<AppDispatch>();
  const { increaseStep, deleteTimeList } = createMeetingActions;
  const { eventTimeList, eventTimeDuration } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const { show } = dialogAction;
  const navigate = useNavigate();

  const eventTimeListDevideByDate = useMemo(
    () =>
      getTimeListDevideByDate(
        eventTimeList.map((dateStr) =>
          getTimezoneDate(new Date(dateStr).getTime())
        )
      ),
    [eventTimeList]
  );

  const subDescription = `총 ${eventTimeList.length}개 선택`;

  const handleDeleteClick = (dateKey: string, time: Date) => {
    if (eventTimeList.length === 1) {
      dispatch(
        show({
          title: '1개 이상 선택해야 합니다.',
        })
      );
    } else {
      dispatch(deleteTimeList(time.getTime()));
    }
  };

  const handleNextClick = () => {
    navigate(PathName.createPlace);
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
                <div
                  className={classNames('time-select-time-card', 'no-cursor')}
                >
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

export default SelectedOptions;
