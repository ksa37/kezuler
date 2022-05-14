import React, { useEffect } from 'react';

import useKakaoLogin from '../hooks/useKakaoLogin';

function Kakao() {
  const { getKakaoToken } = useKakaoLogin();
  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    if (code) {
      console.log(code);
      getKakaoToken(code);
    }
  }, [code]);

  // useEffect(async () => {
  //   await kakaoLogin(code);
  // }, []);

  return <div> heeloo </div>;
}

export default Kakao;
