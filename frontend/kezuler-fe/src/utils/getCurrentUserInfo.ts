import { User } from 'src/types/user';

const getCurrentUserInfo = (): User | null => {
  const userInfo = localStorage.getItem('CURRENT_USER_INFO');
  if (!userInfo) {
    return null;
  }
  return JSON.parse(userInfo);
};

export default getCurrentUserInfo;
