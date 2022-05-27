import React from 'react';

import './App.scss';

function TemporaryApp() {
  return (
    <div>
      <header
        style={{
          fontSize: 50,
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <b>Kezuler</b>
      </header>
      <footer
        style={{
          position: 'absolute',
          height: '5%',
          width: '100%',
          bottom: 0,
          fontSize: 20,
          textAlign: 'center',
          alignItems: 'center',
          backgroundColor: 'lightgray',
        }}
      >
        (주)올렌다 대표이사 구자룡 서울특별시 성북구 오패산로3길
        136-12(하월곡동) 사업자 등록번호 736-87-01642
      </footer>
    </div>
  );
}

export default TemporaryApp;
