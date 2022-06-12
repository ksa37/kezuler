import React from 'react';
import { Button } from '@mui/material';

import { KAKAO_AUTH_URL } from 'src/constants/Auth';

import { ReactComponent as YellowBackground } from 'src/assets/bg_round_y.svg';
import { ReactComponent as TalkingImg } from 'src/assets/img_talking.svg';
// import { ReactComponent as KakaoIcon } from 'src/assets/icn_kakao_small.svg';
import KakaoIcon from 'src/assets/kakao_png.png';
import { ReactComponent as KezulerLogoEn } from 'src/assets/logo_kezuler_en.svg';
import { ReactComponent as KezulerLogoKo } from 'src/assets/logo_kezuler_ko.svg';
import 'src/styles/login.scss';

function Login() {
  const isEnglish = false;
  return (
    <>
      <div className={'login-kezuler-logo'}>
        {isEnglish ? <KezulerLogoEn /> : <KezulerLogoKo />}
      </div>
      <TalkingImg className={'login-talking-img'} />
      <YellowBackground className={'login-bottom-bg'} />
      {/* <KakaoIcon className={'login-kakao-icn'} /> */}
      <Button
        href={KAKAO_AUTH_URL}
        className={'login-kakao-btn'}
        // startIcon={<KakaoIcon className={'login-kakao-icn'} />}
        startIcon={
          <img src={KakaoIcon} alt="1" className={'login-kakao-icn'} />
        }
      >
        {/* <img src={kakaologo}></img> */}
        <div className={'login-kakao-text'}>카카오로 계속하기</div>
      </Button>
    </>
  );
}

export default Login;
