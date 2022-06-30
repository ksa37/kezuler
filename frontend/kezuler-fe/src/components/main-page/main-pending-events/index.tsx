import React, { useEffect } from 'react';
import classNames from 'classnames';

import useMainPending from 'src/hooks/useMainPending';

import BottomPopper from '../../common/BottomPopper';
import PendingEventCard from './PendingEventCard';
import MainButtonContainer from 'src/components/main-page/MainButtonContainer';

function MainPendingEvents() {
  const { events, isFetched, getPendingEvents } = useMainPending();

  useEffect(() => {
    getPendingEvents();
  }, []);

  const handleConnectClick = () => {
    console.log('connect');
  };

  // TODO 캘린더 연동 체크
  const isCalenderConnected = false;

  if (!isFetched) {
    return null;
  }

  if (!events.length && !isCalenderConnected) {
    return (
      <div className={'main-pending'}>
        <h2 className={classNames('main-empty-h2', 'pending')}>
          대기중인 미팅이 없습니다.
        </h2>
        <MainButtonContainer />
        <BottomPopper
          title={'케줄러 100% 활용하기'}
          description={'캘린더를 연동하여 이중약속을 방지해요!'}
          buttonText={'구글캘린더 연동하기'}
          onClick={handleConnectClick}
          image={''}
        />
      </div>
    );
  }

  return (
    <div className={'main-pending'}>
      {events ? (
        events.map((e) => <PendingEventCard key={e.eventId} event={e} />)
      ) : (
        <h2 className={'main-empty-h2'}>대기중인 미팅이 없습니다.</h2>
      )}
      {/* <MainButtonContainer /> */}
    </div>
  );
}

export default MainPendingEvents;
