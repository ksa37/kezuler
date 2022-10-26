import React from 'react';

import GLogo from 'src/assets/image/g-logo.png';
import 'src/styles/components.scss';

function GoogleToggleOn({ onClick }: any) {
  return (
    <div className="google-login-on" onClick={onClick}>
      <img src={GLogo} className="google-login-on-logo" />
      <div className="google-login-on-text">Google 계정으로 연결하기</div>
    </div>
  );
}

export default GoogleToggleOn;
