import axios from 'axios';

// 집
// const HOST_ADDRESS = 'http://192.168.200.157:8888';
// 회사
const HOST_ADDRESS = 'http://172.30.1.55:8888';

const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;

const KezulerStorageInstance = (() => {
  const instance = axios.create({
    baseURL: HOST_ADDRESS,
  });
  return instance;
})();

export { HOST_ADDRESS };
export default KezulerStorageInstance;
