import React from 'react';
import { Button } from '@mui/material';

import { KAKAO_AUTH_URL } from 'src/constants/Auth';

import KakaoIcon from 'src/assets/img_kakao.svg';
import { ReactComponent as PCIntro } from 'src/assets/pc_intro.svg';
// import 'src/styles/login.scss';
import 'src/styles/index.scss';

function KezulerIntro() {
  return (
    <div className={'kezuler-intro'}>
      <PCIntro />
      {/* <div className={'kezuler-intro-title'}>
        일잘러들을 위한 <br />
        <span>스마트</span> 스케줄러
        <div className={'kezuler-intro-title-bold'}>케:줄러</div>
      </div>
      <div className={'kezuler-intro-decription'}>
        커뮤니케이션 핑퐁은 이제 그만!
        <br />
        단 하나의 케줄러 링크로 <br />
        스마트하게 미팅을 조율해봐요 🙌
      </div> */}

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
      {/* <div>
        <img src={KakaoIcon} alt="1" className={'login-kakao-icn'} />
        <div className={'login-kakao-text'}>카카오로 원클릭 로그인!</div>
      </div> */}
    </div>
  );
}

export default KezulerIntro;
