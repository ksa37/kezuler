import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import PathName from 'src/constants/PathName';

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
      <Button onClick={handleHomeClick}>홈으로 가기</Button>
    </>
  );
}

export default AcceptanceCompletion;
