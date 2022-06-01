import React, { useState } from 'react';

import MainFixedEvents from 'src/components/main-page/main-fixed-events';
import MainPendingEvents from 'src/components/main-page/main-pending-events';
import MainTab from 'src/components/main-page/MainTab';

import 'src/styles/main.scss';

function MainPage() {
  const [isFixedMeeting, setIsFixedMeeting] = useState(false);

  return (
    <div className={'main-page'}>
      <MainTab
        isFixedMeeting={isFixedMeeting}
        setIsFixedMeeting={setIsFixedMeeting}
      />
      {isFixedMeeting ? <MainFixedEvents /> : <MainPendingEvents />}
    </div>
  );
}

export default MainPage;
