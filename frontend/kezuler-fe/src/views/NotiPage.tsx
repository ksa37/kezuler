import React from 'react';

import MainAppBar from 'src/components/common/MainAppBar';
import NotiCard from 'src/components/noti/NotiCard';

import 'src/styles/noti.scss';

// TODO 여기까지 읽었습니다 표시 어떻게?
function NotiPage() {
  const notifications = [];

  return (
    <>
      <MainAppBar />
      <div className={'noti-page'}>
        <NotiCard />
        <NotiCard />
        <NotiCard />
        <NotiCard />
        <div className={'noti-divider'}>여기까지 읽었어요</div>
        {/*{notifications.map((noti) => <NotiCard />}*/}
      </div>
    </>
  );
}

export default NotiPage;
