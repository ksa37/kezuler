import axios from 'axios';

const HOST_ADDRESS = 'http://localhost:8888';
// const HOST_ADDRESS = 'http://localhost:8888';

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
