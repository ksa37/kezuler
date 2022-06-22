import React from 'react';
import classNames from 'classnames';

interface Props {
  isEmpty: boolean;
  timeRange?: string;
  scheduleTitle?: string;
}

function ScheduleCard({ isEmpty, timeRange, scheduleTitle }: Props) {
  return isEmpty ? (
    <div
      className={classNames('time-select-schedule-card', 'no-schedule')}
    ></div>
  ) : (
    <div className={'time-select-schedule-card'}>
      <div>
        <div className={'schedule-time-range'}>{timeRange}</div>
        <div className={'schedule-title'}>{scheduleTitle}</div>
      </div>
    </div>
  );
}

export default ScheduleCard;
