import { PPatchUser } from 'src/types/user';

import { patchUserById } from 'src/api/user';

const usePatchUserById = () => {
  const changeUserById = (userId: string, ppatchUser: PPatchUser) => {
    patchUserById(userId, ppatchUser)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log('유저 정보 수정 에러', err);
        window.alert('유저 정보 수정중 오류가 생겼습니다');
      });
  };
  return changeUserById;
};

export { usePatchUserById };
