import React from 'react';
import { Button } from '@mui/material';

function CreateMeeting2() {
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <div>
      <h1>어디서 봐요?</h1>
      <h3>만나는 장소를 지정해주세요.</h3>
      <Button onClick={handleClick}>온라인</Button>
      <Button onClick={handleClick}>오프라인</Button>
    </div>
  );
}

export default CreateMeeting2;
