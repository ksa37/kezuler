import React, { useMemo } from 'react';

import { ACCESS_TOKEN_KEY } from 'src/constants/Auth';
import { getCookie } from 'src/utils/cookie';

import { ReactComponent as PCIntro } from 'src/assets/pc_intro.svg';
import 'src/styles/index.scss';

function KezulerIntro() {
  const isLoggedIn = useMemo(() => !!getCookie(ACCESS_TOKEN_KEY), []);
  return (
    <>
      {!isLoggedIn && (
        <div id="kezuler-intro" className={'kezuler-intro'}>
          <PCIntro className={'kezuler-intro-img'} />
        </div>
      )}
    </>
  );
}

export default KezulerIntro;
