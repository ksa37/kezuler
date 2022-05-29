import React from 'react';

import FloatingButton from 'src/components/common/FloatingButton';

function MainButtonContainer() {
  const handleTodayClick = () => {
    console.log('today');
  };

  const handleCreateClick = () => {
    console.log('create');
  };

  /*Floating Buttons Container*/
  return (
    <div>
      <FloatingButton
        icon={<div>hi</div>}
        onClick={handleTodayClick}
        text={'오늘'}
      />
      <FloatingButton
        icon={<div>hi</div>}
        onClick={handleCreateClick}
        text={'미팅추가'}
      />
    </div>
  );
}

export default MainButtonContainer;
