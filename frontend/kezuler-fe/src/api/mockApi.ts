import axios from 'axios';

// import { getCookie } from '../utils/cookie';

// import { ACCESS_TOKEN_KEY } from './Auth';

const KezulerInstance = (() => {
  // const accessToken = getCookie(ACCESS_TOKEN_KEY);

  return axios.create({
    baseURL: 'http://54.180.134.149:8082',
    // ...(accessToken
    //   ? {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         // 'Content-Type': 'application/json',
    //       },
    //     }
    //   : {}),
  });
})();

KezulerInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.reload();
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

const mockApi = (userId: string) => {
  return new Promise((res, rej) =>
    setTimeout(() => {
      if (!userId) {
        rej({ message: 'userId required' });
      }
      res({ data: `api called with user id ${userId}` });
    }, 3000)
  );
};

const getTest = () => KezulerInstance.get('/test');
const getError = () => KezulerInstance.get('/error');

export default mockApi;

export { getTest, getError };
