import React from 'react';
import { Button } from '@mui/material';

import { KAKAO_AUTH_URL } from 'src/constants/Auth';

import KakaoIcon from 'src/assets/img_kakao.svg';
import PCIntro from 'src/assets/pc_intro.svg';
// import 'src/styles/login.scss';
import 'src/styles/index.scss';

function KezulerIntro() {
  return (
    <div className={'kezuler-intro'}>
      <img src={PCIntro} alt="1" />
      {/* <PCIntro /> */}
      <div>
        <Button
          // href={KAKAO_AUTH_URL}
          classes={{ root: 'kezuler-intro-login-kakao-btn' }}
        >
          <img
            src={KakaoIcon}
            alt="1"
            className={'kezuler-intro-login-kakao-icn'}
          />
          <div>카카오로 원클릭 로그인!</div>
        </Button>
      </div>
    </div>
  );
}

export default KezulerIntro;
