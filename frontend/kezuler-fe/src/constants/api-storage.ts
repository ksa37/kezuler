import axios from 'axios';

// 집
const HOST_ADDRESS_STORAGE = 'http://172.30.1.55:8888';
// 회사
// const HOST_ADDRESS_STORAGE = 'https://api-storage.kezuler.com';

const KezulerStorageInstance = (() => {
  const instance = axios.create({
    baseURL: HOST_ADDRESS_STORAGE,
  });
  return instance;
})();

export default KezulerStorageInstance;
