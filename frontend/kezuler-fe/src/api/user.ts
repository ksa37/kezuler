import axios from 'axios';

import KezulerInstance, { HOST_ADDRESS } from 'src/constants/api';
import { PPatchUser, RPostUser, User } from 'src/types/user';

// 로그인 / 회원 가입
// accessToken: Kakao Access Token
const postUser = (accessToken: string) =>
  axios.post<RPostUser>(
    `${HOST_ADDRESS}users/`,
    {
      registerWith: 'kakao',
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

const getUserById = (userId: string) =>
  KezulerInstance.get<User>(`users/${userId}`);

const patchUserById = (userId: string, params: PPatchUser) =>
  KezulerInstance.patch<User>(`users/${userId}`, {
    ...params,
  });

const deleteUserById = (userId: string) =>
  KezulerInstance.delete(`users/${userId}`);

export { postUser, getUserById, patchUserById, deleteUserById };
