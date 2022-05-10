import React, { useEffect } from 'react';

// import { useDispatch } from 'react-redux';
import { kakaoLogin } from '../reducers/Login';
// import Spinner from './Spinner';

function Kakao() {
  console.log('hello!');
  // const dispatch = useDispatch();
  const code = new URL(window.location.href).searchParams.get('code');
  console.log(code);

  // useEffect(async () => {
  //   await kakaoLogin(code);
  // }, []);

  return <div> heeloo </div>;
}

export default Kakao;
