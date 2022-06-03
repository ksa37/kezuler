import React, { useEffect } from 'react';

import useKakaoLogin from 'src/hooks/useKakaoLogin';

function KakaoRedirect() {
  const { getKakaoToken } = useKakaoLogin();
  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    if (code) {
      getKakaoToken(code);
    }
  }, [code]);

  return <div> heeloo </div>;
}

export default KakaoRedirect;
