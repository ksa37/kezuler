import KezulerInstance from 'src/constants/api';
import { PPatchUser, RPostUser, User } from 'src/types/user';

const getUserById = (userId: string) =>
  KezulerInstance.get<User>(`users/${userId}`);

const patchUserById = (userId: string, params: PPatchUser) =>
  KezulerInstance.patch<User>(`users/${userId}`, {
    ...params,
  });

const postUser = () =>
  KezulerInstance.post<RPostUser>(`users/`, {
    registerWith: 'kakao',
  });

const deleteUserById = (userId: string) =>
  KezulerInstance.delete(`users/${userId}`);

export default { getUserById, patchUserById, postUser, deleteUserById };
