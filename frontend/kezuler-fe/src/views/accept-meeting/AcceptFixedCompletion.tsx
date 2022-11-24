import React from 'react';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';

import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as Circle } from 'src/assets/acceptance_complete_circle.svg';
import Bell from 'src/assets/image/notification-bell.png';
import TalkingPeople from 'src/assets/image/talking-people.png';

function AcceptFixedCompletion() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(PathName.mainPending, {
      replace: true,
    });
  };

  return (
    <div className={'acceptance-completion'}>
      <div className={'accept-description-text'}>
        {'미팅 참여를'}
        <br />
        {'환영합니다!'}
      </div>
      <div className={'acceptance-completion-sub-description'}>
        {'미팅 정보에서'}
        <br />
        {'리마인더 기능도 설정해보세요!'}
      </div>
      <BottomButton onClick={handleHomeClick} text={'홈으로 가기'} />
    </div>
  );
}

export default AcceptFixedCompletion;
