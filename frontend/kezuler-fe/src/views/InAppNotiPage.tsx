import React from 'react';

import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import WarningImg from 'src/assets/image/warning.png';
import { ReactComponent as NotFoundBottom } from 'src/assets/notfound_bottom.svg';
import 'src/styles/InAppNotiPage.scss';

function InAppNotiPage() {
  const handleChromeClick = () => {
    location.href =
      'intent://' +
      'https://kezuler.com/mypage'.replace(/https?:\/\//i, '') +
      '#Intent;scheme=http;package=com.android.chrome;end';
  };

  return (
    <>
      <TextAppBar text={'인앱브라우저 호환 문제'} />
      <ProgressBar progress={0} />
      <div className={'inapp-noti-page'}>
        <h2>
          인앱브라우저 호환문제로 인해 <br />
          Chrome으로 접속해야합니다.
        </h2>
        <article className={'inapp-noti-page-content'}>
          아래 버튼을 눌러 Chrome을 실행해주세요 <br />
          구글캘린더 연동을 제외한 모든 서비스는 <br />
          기존의 브라우저에서 사용 가능합니다.
        </article>
        <button
          className={'inapp-noti-page-button'}
          onClick={handleChromeClick}
        >
          크롬으로 열기
        </button>
        <div className={'notfound-bottom-area'}>
          <img src={WarningImg} className={'notfound-warning'} />
          <NotFoundBottom className={'notfound-bottom'} />
        </div>
      </div>
    </>
  );
}

export default InAppNotiPage;
