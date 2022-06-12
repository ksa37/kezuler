import React from 'react';
import classNames from 'classnames';

interface Props {
  isAttendant: boolean;
  setIsAttendant: React.Dispatch<React.SetStateAction<boolean>>;
  attendantsNum: number;
  absentsNum: number;
}

// TODO: number 0 일 때 처리
function ParticipantTab({
  isAttendant,
  setIsAttendant,
  attendantsNum,
  absentsNum,
}: Props) {
  const handleAttendantClick = () => {
    setIsAttendant(true);
  };

  const handleAbsentClick = () => {
    setIsAttendant(false);
  };

  return (
    <div className={'main-tab'}>
      <button
        className={classNames('main-tab-button', 'left', {
          selected: isAttendant,
          disabled: attendantsNum === 0,
        })}
        onClick={handleAttendantClick}
      >
        참여
        <span className={'participants-popup-tab-num'}>{attendantsNum}</span>
      </button>
      <button
        className={classNames('main-tab-button', 'right', {
          selected: !isAttendant,
          disabled: absentsNum === 0,
        })}
        onClick={handleAbsentClick}
      >
        미참여
        <span className={'participants-popup-tab-num'}>{absentsNum}</span>
      </button>
    </div>
  );
}

export default ParticipantTab;
