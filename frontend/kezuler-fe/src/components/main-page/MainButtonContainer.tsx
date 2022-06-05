import React from 'react';

import FloatingButton from 'src/components/common/FloatingButton';

import { ReactComponent as PlusIcon } from 'src/assets/icn_plus.svg';

function MainButtonContainer() {
  const handleCreateClick = () => {
    console.log('create');
  };

  /*Floating Buttons Container*/
  return (
    <div className={'main-floating-button-container'}>
      <FloatingButton
        icon={<PlusIcon />}
        onClick={handleCreateClick}
        text={'미팅추가'}
      />
    </div>
  );
}

export default MainButtonContainer;
