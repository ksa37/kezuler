import { Button } from '@mui/material';
import React from 'react';
import { KAKAO_AUTH_URL } from '../constants/Oauth';

function Login() {
  return (
    <Button href={KAKAO_AUTH_URL}>
      {/* <img src={kakaologo}></img> */}
      <span>카카오계정 로그인</span>
    </Button>
  );
}

export default Login;
