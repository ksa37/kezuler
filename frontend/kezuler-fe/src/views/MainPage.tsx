import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { mainFixedActions } from 'src/reducers/mainFixed';
import { mainPendingActions } from 'src/reducers/mainPending';
import { AppDispatch } from 'src/store';

import MainAppBar from 'src/components/common/MainAppBar';
import MainFixedEvents from 'src/components/main-page/main-fixed-events';
import MainPendingEvents from 'src/components/main-page/main-pending-events';
// import MainButtonContainer from 'src/components/main-page/MainButtonContainer';
import MainTab from 'src/components/main-page/MainTab';

import 'src/styles/main.scss';

function MainPage() {
  const location = useLocation();

  let isFixed = true;

  if (location) {
    const state: any = location.state;
    if (state) {
      isFixed = state.isFixed;
    }
  }
  const [isFixedMeeting, setIsFixedMeeting] = useState(isFixed);

  const dispatch = useDispatch<AppDispatch>();
  const { destroy: fixedDestroy } = mainFixedActions;
  const { destroy: pendingDestroy } = mainPendingActions;

  // 페이지 나갈 때 redux 스토어 초기화
  useEffect(() => {
    return () => {
      dispatch(fixedDestroy());
      dispatch(pendingDestroy());
    };
  }, []);

  return (
    <div className={'main-page-wrapper'}>
      <div className={'main-page'}>
        <MainAppBar />
        <MainTab
          isFixedMeeting={isFixedMeeting}
          setIsFixedMeeting={setIsFixedMeeting}
        />
        {isFixedMeeting ? <MainFixedEvents /> : <MainPendingEvents />}
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
