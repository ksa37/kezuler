import React from 'react';
import classNames from 'classnames';

import { ReactComponent as CheckedIcon } from 'src/assets/icn_checked.svg';
import { ReactComponent as NotCheckedIcon } from 'src/assets/icon_not_checked.svg';
import { ReactComponent as ProfileIcon } from 'src/assets/icon_profile.svg';

interface Props {
  isEmpty: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  timeRange?: string;
  possibleNum?: number;
}

function TimeCard({
  isEmpty,
  isSelected,
  onClick,
  timeRange,
  possibleNum,
}: Props) {
  return isEmpty ? (
    <div className={classNames('time-select-time-card', 'no-time')}></div>
  ) : (
    <div className={'time-select-time-card'} onClick={onClick}>
      <div
        className={classNames(
          'time-select-time-content',
          isSelected ? 'selected' : ''
        )}
      >
        <div className={'option-time-range'}>{timeRange}</div>
        <div className={'profile-icon'}>
          <ProfileIcon />
        </div>
        <div className={'possible-num'}>{possibleNum}</div>
      </div>
      <div className="check-box-icon">
        {isSelected ? <CheckedIcon /> : <NotCheckedIcon />}
      </div>
    </div>
  );
}

export default TimeCard;
