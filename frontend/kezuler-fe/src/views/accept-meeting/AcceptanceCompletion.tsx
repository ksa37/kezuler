import React from 'react';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';

import BottomButton from 'src/components/common/BottomButton';

function AcceptanceCompletion() {
  const navigate = useNavigate();

  const completeMainDescription = '일정 선택이 모두 완료되었습니다!';
  const completeSubDescription =
    '호스트가 미팅시간을 확정하면 다시 알려드릴게요.';

  const handleHomeClick = () => {
    navigate(PathName.main, { replace: true });
  };

  return (
    <>
      <h2>{completeMainDescription}</h2>
      <h3>{completeSubDescription}</h3>
      <BottomButton onClick={handleHomeClick} text={'홈으로 가기'} />
    </>
  );
}

export default AcceptanceCompletion;
