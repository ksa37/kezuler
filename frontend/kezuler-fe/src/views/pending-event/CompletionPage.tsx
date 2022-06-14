import React from 'react';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';

import BottomButton from 'src/components/common/BottomButton';
import BottomPopper from 'src/components/common/BottomPopper';

function CompletionPage() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(PathName.main, { replace: true });
  };

  const handleConnectClick = () => {
    console.log('calendar pair connect needed!');
  };

  return (
    <div className={'acceptance-completion'}>
      <div className={'accept-description-text'}>
        {'미팅 시간이'}
        <br />
        {'확정되었습니다.'}
      </div>
      <div className={'acceptance-completion-sub-description'}>
        {'미팅 참여자들에게'}
        <br />
        {'확정된 일정이 전송되었습니다.'}
      </div>
      <BottomPopper
        title={'케줄러 100% 활용하기'}
        description={'캘린더를 연동하여 이중약속을 방지해요!'}
        buttonText={'구글캘린더 연동하기'}
        onClick={handleConnectClick}
        image={''}
      />
      <BottomButton onClick={handleHomeClick} text={'홈으로 가기'} />
    </div>
  );
}

export default CompletionPage;
