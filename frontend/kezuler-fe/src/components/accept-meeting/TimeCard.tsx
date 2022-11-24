import React from 'react';
import classNames from 'classnames';

import { EventTimeListWithPossibleNum } from '../../types/calendar';
import { getTimeRange } from '../../utils/dateParser';
import { getUTCDate } from '../../utils/getTimezoneDate';

import { ReactComponent as CheckedIcon } from 'src/assets/icn_checked.svg';
import { ReactComponent as NotCheckedIcon } from 'src/assets/icon_not_checked.svg';
import { ReactComponent as ProfileIcon } from 'src/assets/icon_profile.svg';

interface Props {
  etl: EventTimeListWithPossibleNum;
  onEventClick: (startTime: Date) => void;
  getIsSelected: (utcTimestamp: number) => boolean;
  eventTimeDuration: number;
}

function TimeCard({
  etl,
  getIsSelected,
  onEventClick,
  eventTimeDuration,
}: Props) {
  const startTime = etl.eventStartsAt;
  const possibleNum = etl.possibleNum;
  const isSelected = getIsSelected(getUTCDate(startTime.getTime()).getTime());
  const timeRange = getTimeRange(startTime, eventTimeDuration);
  const isPast = startTime.getTime() < new Date().getTime();

  return (
    <div
      className={classNames('time-select-time-card', {
        past: isPast,
      })}
      onClick={() => onEventClick(startTime)}
    >
      <div
        className={classNames('time-select-time-content', {
          selected: isSelected,
        })}
      >
        <div className={'option-time-range'}>{timeRange}</div>
        <div>
          <ProfileIcon />
        </div>
        <div>{possibleNum}</div>
      </div>
      <div className="check-box-icon">
        {isSelected ? <CheckedIcon /> : <NotCheckedIcon />}
      </div>
    </div>
  );
}

export default TimeCard;
