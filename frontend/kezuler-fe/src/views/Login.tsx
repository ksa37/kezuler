import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { KAKAO_AUTH_URL } from 'src/constants/Oauth';
import useModal from 'src/hooks/useModal';
import { RootState } from 'src/reducers';
import { mockThunkAction } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import BottomButton from 'src/components/common/BottomButton';

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data, errorMessage } = useSelector(
    (state: RootState) => state.acceptMeeting
  );

  const { openModal } = useModal();
  const handleModalOpenClick = () => {
    openModal('Overview', { userId: '123' });
  };
  const handleFetchClick = () => {
    dispatch(mockThunkAction(''));
  };

  if (loading) {
    return <div>loading...</div>;
  }
  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }
  if (data) {
    return <div>{data}</div>;
  }
  return (
    <>
      {/* <ShowSelectedOptions /> */}
      <Button href={KAKAO_AUTH_URL}>
        {/* <img src={kakaologo}></img> */}
        <span>카카오계정 로그인</span>
      </Button>
      <Button onClick={handleModalOpenClick}>Modal Open Test</Button>
      <Button onClick={handleFetchClick}>Thunk Test</Button>
      <BottomButton onClick={() => console.log('hi')} text="다음" />
      {/* <MeetingCard/> */}
    </>
  );
}

export default Login;
