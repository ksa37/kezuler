import React, { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { LOGIN_REDIRECT_KEY } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import useKakaoLogin, { useKakaoLogin2 } from 'src/hooks/useKakaoLogin';

import { getAuth } from 'src/api/user';

function KakaoRedirect() {
  const { getKakaoToken } = useKakaoLogin();
  console.log(window.location.href);
  const urlParams = new URL(window.location.href).searchParams;
  const code = urlParams.get('code');
  const redirectURI = urlParams.get('state');
  getAuth();
  useEffect(() => {
    if (code) {
      let path = sessionStorage.getItem(LOGIN_REDIRECT_KEY) as PathName;
      sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
      if (!path) {
        path = redirectURI as PathName;
      }
      console.log(path);
      getKakaoToken(code, path ? (path as PathName) : PathName.mainFixed);
    }
  }, [code]);

  return (
    <div className={'circular-progress-bar-wrapper'}>
      <CircularProgress classes={{ root: 'circular-progress-bar' }} />
    </div>
  );
}

export default KakaoRedirect;
