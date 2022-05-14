import React from 'react';
import { Button, Chip, Stack, TextField } from '@mui/material';

import ReminderOptions from '../../constants/ReminderOptions';

import BlackButton from '../../components/BlackButton';

function CreateMeeting4() {
  const handleClick = () => {
    console.log('clicked!');
  };

  return (
    <>
      <h1>미팅 정보</h1>
      <h3>미팅 제목</h3>
      <TextField id="standard-basic" variant="standard" />
      <h3>미팅 소개</h3>
      <TextField id="standard-basic" variant="standard" />
      <h3>리마인드 설정</h3>
      <Stack direction="row" spacing={1}>
        {ReminderOptions.map((timeOption) => (
          <Chip
            key={timeOption}
            label={timeOption}
            variant="outlined"
            onClick={handleClick}
          />
        ))}
      </Stack>
      <h3>참고 자료</h3>
      <label htmlFor="contained-button-file">
        <input
          style={{ display: 'none' }}
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
        />
        <Button variant="contained" component="span">
          파일 추가
        </Button>
      </label>
      <BlackButton onClick={handleClick} text="완료" />
    </>
  );
}

export default CreateMeeting4;
