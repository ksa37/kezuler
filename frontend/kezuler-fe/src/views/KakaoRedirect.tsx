import React, { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { LOGIN_REDIRECT_KEY } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import useKakaoLogin from 'src/hooks/useKakaoLogin';

function KakaoRedirect() {
  const { getKakaoToken } = useKakaoLogin();
  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    if (code) {
      const path = sessionStorage.getItem(LOGIN_REDIRECT_KEY) as PathName;
      sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
      getKakaoToken(code, path ? (path as PathName) : PathName.main);
    }
  }, [code]);

  return (
    <div className={'circular-progress-bar-wrapper'}>
      <CircularProgress classes={{ root: 'circular-progress-bar' }} />
    </div>
  );
}

export default KakaoRedirect;
