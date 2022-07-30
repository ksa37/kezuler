import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import { ACCESS_TOKEN_KEY } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import { getCookie } from 'src/utils/cookie';

import TextAppBar from 'src/components/common/TextAppBar';
import ProgressBar from 'src/components/ProgressBar';

import WarningImg from 'src/assets/image/warning.png';
import { ReactComponent as NotFoundBottom } from 'src/assets/notfound_bottom.svg';
import 'src/styles/notfound.scss';

function NotFound() {
  const isLoggedIn = useMemo(() => !!getCookie(ACCESS_TOKEN_KEY), []);
  const navigate = useNavigate();
  const handleGoHome = () => {
    if (isLoggedIn) {
      navigate(PathName.mainFixed, { replace: true });
    } else {
      navigate(PathName.login, { replace: true });
    }
  };
  return (
    <>
      <TextAppBar text={'페이지 오류'} />
      <ProgressBar progress={0} />
      <div className={'notfound-wrapper'}>
        <div className={'notfound-404'}>404</div>
        <div className={'notfound-desc'}>이 페이지를 표시할 수 없습니다.</div>
        <div className={'notfound-sub-desc'}>
          요청하신 페이지가 사라졌거나,
          <br />
          잘못된 경로를 사용하셨습니다.
        </div>
        <Button onClick={handleGoHome} classes={{ root: 'notfound-btn' }}>
          <div>홈으로 돌아가기</div>
        </Button>
        <div className={'notfound-bottom-area'}>
          <img src={WarningImg} className={'notfound-warning'} />
          <NotFoundBottom className={'notfound-bottom'} />
        </div>
      </div>
    </>
  );
}

export default NotFound;
