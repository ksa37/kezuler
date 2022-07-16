import React from 'react';
import Button from '@mui/material/Button';

import { KAKAO_AUTH_URL } from 'src/constants/Auth';

import TalkingPeople from 'src/assets/image/talking-people.png';
import KakaoIcon from 'src/assets/img_kakao.svg';
import { ReactComponent as KezulerLogoEn } from 'src/assets/logo_kezuler_en.svg';
import { ReactComponent as KezulerLogoKo } from 'src/assets/logo_kezuler_ko.svg';
import 'src/styles/login.scss';

function Login() {
  const isEnglish = false;
  return (
    <div className={'login-wrapper'}>
      <div className={'login-kezuler-description'}>
        일잘러들을 위한 스마트 스케줄러
      </div>
      <div className={'login-kezuler-logo'}>
        {isEnglish ? <KezulerLogoEn /> : <KezulerLogoKo />}
      </div>
      <img src={TalkingPeople} className={'login-talking-img'} alt={''} />
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
