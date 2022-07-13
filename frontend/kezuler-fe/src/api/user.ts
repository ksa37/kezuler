import axios from 'axios';

import KezulerInstance, { HOST_ADDRESS } from 'src/constants/api';
import {
  PPatchUser,
  PPatchUserExceptProfileImage,
  RPostUser,
  SettingUser,
  User,
} from 'src/types/user';

// 로그인 / 회원 가입
// accessToken: Kakao Access Token
const postUser = (accessToken: string) =>
  axios.post<RPostUser>(
    `${HOST_ADDRESS}/user`,
    {
      registerWith: 'kakao',
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

// 현재 유저 정보 가져오기
const getUser = () => KezulerInstance.get<SettingUser>('user');

// 현재 유저 정부 수정 (프로필 이미지 제외)
const patchUser = (params: PPatchUserExceptProfileImage) =>
  KezulerInstance.patch<User>('user', {
    ...params,
  });

// 현재 유저 프로필 이미지 변경
const patchUserProfileImage = (profileImage: File) => {
  const form = new FormData();
  form.append('userProfileImage', profileImage);
  return KezulerInstance.patch<User>('user', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 현재 유저 정보 삭제
const deleteUser = () => KezulerInstance.delete('user');

export { postUser, getUser, patchUser, patchUserProfileImage, deleteUser };
