import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import useMainPending from 'src/hooks/useMainPending';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import BottomPopper from '../../common/BottomPopper';
import MainButtonContainer from '../MainButtonContainer';
import PendingEventCard from './PendingEventCard';

import BottomCalendarBg from 'src/assets/img_bottom_popper_calendar.svg';

import { getCalendarLink } from 'src/api/calendar';
function MainPendingEvents() {
  const { events, isFetched, getPendingEvents } = useMainPending();

  let googleToggle: boolean | undefined = getCurrentUserInfo()?.googleToggle;

  useEffect(() => {
    getPendingEvents();
    googleToggle = getCurrentUserInfo()?.googleToggle;
  }, []);

  const handleConnectClick = () => {
    if (!googleToggle) {
      getCalendarLink().then((res) => {
        location.href = res.data.result;
      });
    }
  };

  const [popupOpened, setPopupOpened] = useState(true);

  const handleClosePopper = () => {
    setPopupOpened(false);
  };

  if (!isFetched) {
    return null;
  }

  if (!events.length) {
    return (
      <>
        <div className={'main-pending'}>
          <h2 className={'main-empty-h2'}>대기중인 미팅이 없습니다.</h2>
          {!googleToggle && (
            <BottomPopper
              title={'케줄러 100% 활용하기'}
              description={'캘린더를 연동하여 이중약속을 방지해요!'}
              buttonText={'구글 계정 연동하기'}
              onClick={handleConnectClick}
              onDisableClick={handleClosePopper}
              image={BottomCalendarBg}
            />
          )}
        </div>
        {(!popupOpened || googleToggle) && <MainButtonContainer />}
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
