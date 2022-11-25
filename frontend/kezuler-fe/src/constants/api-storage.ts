import axios from 'axios';

// 집
// const HOST_ADDRESS = 'http://192.168.200.157:8888';
// 회사
const HOST_ADDRESS_STORAGE = 'http://3.37.216.141';

const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;

const KezulerStorageInstance = (() => {
  const instance = axios.create({
    baseURL: HOST_ADDRESS_STORAGE,
  });
  return instance;
})();

export default KezulerStorageInstance;
