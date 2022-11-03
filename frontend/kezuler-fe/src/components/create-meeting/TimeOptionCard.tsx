import React from 'react';
import classNames from 'classnames';

import { ReactComponent as DeleteIcon } from 'src/assets/icn_trash.svg';

interface Props {
  isEmpty: boolean;
  onDeleteClick?: () => void;
  timeRange?: string;
}

function TimeOptionCard({ isEmpty, onDeleteClick, timeRange }: Props) {
  return isEmpty ? (
    <div className={classNames('time-select-time-card', 'no-time')}></div>
  ) : (
    <div className={classNames('time-select-time-card', 'no-cursor')}>
      <div className={'time-select-time-content'}>{timeRange}</div>
      <div className="check-box-icon" onClick={onDeleteClick}>
        <DeleteIcon />
      </div>
    </div>
  );
}

export default TimeOptionCard;
