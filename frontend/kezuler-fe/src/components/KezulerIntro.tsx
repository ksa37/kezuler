import React from 'react';

import useIsLoggedIn from 'src/hooks/useIsLoggedIn';

import { ReactComponent as PCIntro } from 'src/assets/pc_intro.svg';
import 'src/styles/index.scss';

function KezulerIntro() {
  const isLoggedIn = useIsLoggedIn();
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
