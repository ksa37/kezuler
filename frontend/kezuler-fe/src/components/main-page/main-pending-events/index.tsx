import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import useMainPending from 'src/hooks/useMainPending';

import BottomPopper from '../../common/BottomPopper';
import PendingEventCard from './PendingEventCard';

import BottomCalendarBg from 'src/assets/img_bottom_popper_calendar.svg';
import MainButtonContainer from "../MainButtonContainer";
function MainPendingEvents() {
  const { events, isFetched, getPendingEvents } = useMainPending();

  useEffect(() => {
    getPendingEvents();
  }, []);

  const handleConnectClick = () => {
    //TODO 캘린더 연동
    console.log('connect');
  };

  const [popupOpened, setPopupOpened] = useState(true);

  const handleClosePopper = () => {
    setPopupOpened(false);
  };

  // TODO 캘린더 연동 체크
  const isCalenderConnected = false;

  if (!isFetched) {
    return null;
  }

  if (!events.length) {
    return (
      <>
        <div className={'main-pending'}>
          <h2 className={'main-empty-h2'}>대기중인 미팅이 없습니다.</h2>
          {!isCalenderConnected && (
            <BottomPopper
              title={'케줄러 100% 활용하기'}
              description={'캘린더를 연동하여 이중약속을 방지해요!'}
              buttonText={'구글캘린더 연동하기'}
              onClick={handleConnectClick}
              onDisableClick={handleClosePopper}
              image={BottomCalendarBg}
            />
          )}
        </div>
        {!popupOpened && <MainButtonContainer />}
      </>
    );
  }

  return (
    <>
      <div className={'main-pending'}>
        {events ? (
          events.map((e) => <PendingEventCard key={e.eventId} event={e} />)
        ) : (
          <h2 className={'main-empty-h2'}>대기중인 미팅이 없습니다.</h2>
        )}
        <Outlet />
      </div>
      <MainButtonContainer />
    </>
  );
}

export default MainPendingEvents;
