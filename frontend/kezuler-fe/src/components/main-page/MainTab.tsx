import React from 'react';
import classNames from 'classnames';

interface Props {
  isFixedMeeting: boolean;
  setIsFixedMeeting: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainTab({ isFixedMeeting, setIsFixedMeeting }: Props) {
  const handleFixedClick = () => {
    setIsFixedMeeting(true);
  };

  const handlePendingClick = () => {
    setIsFixedMeeting(false);
  };

  return (
    <div className={'main-tab'}>
      <button
        className={classNames('main-tab-button', 'left', {
          selected: isFixedMeeting,
        })}
        onClick={handleFixedClick}
      >
        다가오는 미팅
      </button>
      <button
        className={classNames('main-tab-button', 'right', {
          selected: !isFixedMeeting,
        })}
        onClick={handlePendingClick}
      >
        대기중인 미팅
      </button>
    </div>
  );
}

export default MainTab;
