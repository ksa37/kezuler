import * as React from 'react';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@mui/material';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import CommonAppBar from 'src/components/common/CommonAppBar';

import { ReactComponent as BellIcon } from 'src/assets/icn_bell.svg';
import logo from 'src/assets/logo-kezuler.png';

function MainAppBar() {
  const hasNew = true;
  const currentUser = useMemo(() => getCurrentUserInfo(), []);

  return (
    <CommonAppBar>
      <div className={'main-app-bar'}>
        <img src={logo} alt="logo" height={24} />
        <div className={'main-app-bar-btn'}>
          <NavLink
            className={classNames({
              new: hasNew,
            })}
            to={PathName.notification}
          >
            <BellIcon />
          </NavLink>
          <NavLink to={PathName.myPage}>
            <Avatar
              alt={currentUser?.userName}
              src={currentUser?.userProfileImage}
            />
          </NavLink>
        </div>
      </div>
    </CommonAppBar>
  );
}

export default MainAppBar;
