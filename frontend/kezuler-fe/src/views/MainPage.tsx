import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { mainFixedActions } from 'src/reducers/mainFixed';
import { mainPendingActions } from 'src/reducers/mainPending';
import { AppDispatch } from 'src/store';

import MainAppBar from 'src/components/common/MainAppBar';
import MainTab from 'src/components/main-page/MainTab';

import 'src/styles/main.scss';
import Tutorials from 'src/components/Tutorials';

function MainPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { destroy: fixedDestroy } = mainFixedActions;
  const { destroy: pendingDestroy } = mainPendingActions;
  const navigate = useNavigate();

  // 페이지 나갈 때 redux 스토어 초기화
  useEffect(() => {
    return () => {
      dispatch(fixedDestroy());
      dispatch(pendingDestroy());
    };
  }, []);

  window.onpopstate = function () {
    const prevUrl = document.referrer;
    //뒤로가기를 한 페이지가 미팅일정선택완료 페이지면 메인페이지(fixed)로 이동.
    if (prevUrl.indexOf('/invite') >= 0 && prevUrl.indexOf('/complete') >= 0) {
      navigate(PathName.mainFixed);
    }
  };

  return (
    <div className={'main-page-wrapper'}>
      <div className={'main-page'}>
        <MainAppBar />
        <MainTab />
        <Outlet />
        {/* <Tutorials /> */}
        {/* <footer className={'main-footer'}>
        <b>(주)올렌다</b> 대표이사 구자룡
        <br />
        서울특별시 성북구 오패산로3길 136-12(하월곡동) <br />
        사업자 등록번호 736-87-01642
      </footer> */}
      </div>
    </div>
  );
}

export default MainPage;
