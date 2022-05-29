import React from 'react';

import FloatingButton from 'src/components/common/FloatingButton';

function MainButtonContainer() {
  const handleCreateClick = () => {
    console.log('create');
  };

  /*Floating Buttons Container*/
  return (
    <div className={'main-floating-button-container'}>
      <FloatingButton
        icon={<div>hi</div>}
        onClick={handleCreateClick}
        text={'미팅추가'}
      />
    </div>
  );
}

export default MainButtonContainer;
