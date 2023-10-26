import React from 'react';
import { NavLink } from 'react-router-dom';

import PathName from 'src/constants/PathName';

import { ReactComponent as PlusIcon } from 'src/assets/icn_plus.svg';

function MainButtonContainer() {
  return (
    <div className={'main-floating-button-container'}>
      <NavLink className={'main-floating-button'} to={PathName.create}>
        <div className={'main-floating-button-icon'}>
          <PlusIcon />
        </div>
        <div className={'main-floating-button-text'}>{'미팅생성'}</div>
      </NavLink>
    </div>
  );
}

export default MainButtonContainer;
