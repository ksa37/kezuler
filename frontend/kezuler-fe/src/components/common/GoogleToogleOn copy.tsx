import React from 'react';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';

import GLogo from 'src/assets/image/g-logo.png';
import 'src/styles/components.scss';

function GoogleToggleOff({ onClick, userEmail }: any) {
  return (
    <div className="google-login-off">
      <img src={GLogo} className="google-login-off-logo" />
      <div className="google-login-off-info">
        <div>Google</div>
        <div className="google-login-off-info-gray">{userEmail}</div>
      </div>
      <div className="google-login-off-disconnect" onClick={onClick}>
        <DoNotDisturbAltIcon />
        <div className="google-login-off-disconnect-gray">연결 해제</div>
      </div>
    </div>
  );
}

export default GoogleToggleOff;
