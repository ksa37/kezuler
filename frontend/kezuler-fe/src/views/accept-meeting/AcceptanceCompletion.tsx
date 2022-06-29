import React from 'react';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';

import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as Bell } from 'src/assets/acceptance_complete_bell.svg';
import { ReactComponent as Circle } from 'src/assets/acceptance_complete_circle.svg';
import { ReactComponent as TalkingPeople } from 'src/assets/img_talking_small.svg';

function AcceptanceCompletion() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(PathName.main, { replace: true, state: { isFixed: false } });
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
      <Bell className={'acceptance-bell'} />
      <Circle className={'acceptance-circle'} />
      <TalkingPeople className={'acceptance-talking-people'} />
      <BottomButton onClick={handleHomeClick} text={'홈으로 가기'} />
    </div>
  );
}

export default AcceptanceCompletion;
