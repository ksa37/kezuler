import axios from 'axios';

const HOST_ADDRESS =
  'https://efb4a784-1e8c-4296-8029-3fb7a7262580.mock.pstmn.io/';

const UNAUTHORIZED_STATUS_CODE = 401;

// FIXME: 로그인하는 시점에 토큰 저장 필요함
const KezulerInstance = (() => {
  const token = localStorage.getItem('kezulerToken');

  return axios.create({
    baseURL: HOST_ADDRESS,
    ...(token
      ? {
          headers: {
            Authorization: token,
          },
        }
      : {}),
  });
})();

KezulerInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === UNAUTHORIZED_STATUS_CODE) {
      localStorage.clear();
      window.location.reload();
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export { HOST_ADDRESS, UNAUTHORIZED_STATUS_CODE };
export default KezulerInstance;
