import React from 'react';
import { TextField } from '@mui/material';

import BlackButton from '../../components/BlackButton';

function CreateMeeting3() {
  const isOnline = false;
  const onlineTextDescription = '줌 링크 혹은 다른 화상회의 링크를 넣어주세요';
  const offlineTextDescription = '장소 이름 혹은 지도 링크를 넣어주세요';
  const handleClick = () => {
    console.log('clicked');
  };
  return (
    <>
      {isOnline ? (
        <div>
          <h1>온라인 링크</h1>
          <TextField
            id="standard-basic"
            label={onlineTextDescription}
            variant="standard"
          />
        </div>
      ) : (
        <div>
          <h1>오프라인 주소</h1>
          <TextField
            id="standard-basic"
            label={offlineTextDescription}
            variant="standard"
          />
        </div>
      )}
      <BlackButton onClick={handleClick} text="다음" />
    </>
  );
}

export default CreateMeeting3;
