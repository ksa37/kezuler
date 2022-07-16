import React from 'react';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';

import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as Circle } from 'src/assets/acceptance_complete_circle.svg';
import Bell from 'src/assets/image/notification-bell.png';
import TalkingPeople from 'src/assets/image/talking-people.png';

function AcceptanceCompletion() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(PathName.mainPending, {
      replace: true,
    });
  };

  return (
    <div className={'acceptance-completion'}>
      <div className={'accept-description-text'}>
        {'일정 선택이'}
        <br />
        {'모두 완료되었습니다!'}
      </div>
      <div className={'acceptance-completion-sub-description'}>
        {'호스트가 미팅시간을 확정하면'}
        <br />
        {'다시 알려드릴게요.'}
      </div>
      <div className={'acceptance-complete-imgs'}>
        <div className={'acceptance-bell-container'}>
          <img className={'acceptance-bell'} src={Bell} alt={''} />
        </div>
        <Circle className={'acceptance-circle'} />
        <img
          className={'acceptance-talking-people'}
          src={TalkingPeople}
          alt={''}
        />
      </div>
      <BottomButton onClick={handleHomeClick} text={'홈으로 가기'} />
    </div>
  );
}

export default AcceptanceCompletion;
