import React from 'react';
import { Button } from '@mui/material';

import { KAKAO_AUTH_URL } from 'src/constants/Auth';

import KakaoIcon from 'src/assets/img_kakao.svg';
import { ReactComponent as TalkingImg } from 'src/assets/img_talking.svg';
import { ReactComponent as KezulerLogoEn } from 'src/assets/logo_kezuler_en.svg';
import { ReactComponent as KezulerLogoKo } from 'src/assets/logo_kezuler_ko.svg';
import 'src/styles/login.scss';

function Login() {
  const isEnglish = false;
  return (
    <div className={'login-wrapper'}>
      <div className={'login-kezuler-logo'}>
        {isEnglish ? <KezulerLogoEn /> : <KezulerLogoKo />}
      </div>
      <div className={'login-talking-img'}>
        <TalkingImg />
      </div>
      <div className={'login-bottom-bg'} />
      <div className={'login-btn-wrapper'}>
        <Button href={KAKAO_AUTH_URL} classes={{ root: 'login-kakao-btn' }}>
          <img src={KakaoIcon} alt="1" className={'login-kakao-icn'} />
          <div className={'login-kakao-text'}>카카오로 계속하기</div>
        </Button>
      </div>
    </div>
  );
}

export default Login;
