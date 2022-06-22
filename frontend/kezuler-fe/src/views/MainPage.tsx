import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { mainFixedActions } from 'src/reducers/mainFixed';
import { mainPendingActions } from 'src/reducers/mainPending';
import { AppDispatch } from 'src/store';

import MainAppBar from 'src/components/common/MainAppBar';
import MainFixedEvents from 'src/components/main-page/main-fixed-events';
import MainPendingEvents from 'src/components/main-page/main-pending-events';
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
    <div className={'main-page'}>
      <MainAppBar />
      <MainTab
        isFixedMeeting={isFixedMeeting}
        setIsFixedMeeting={setIsFixedMeeting}
      />
      {isFixedMeeting ? <MainFixedEvents /> : <MainPendingEvents />}
    </div>
  );
}

export default MainPage;
