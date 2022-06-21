import { CURRENT_USER_INFO_KEY } from 'src/constants/Auth';
import { SettingUser, User } from 'src/types/user';

const getCurrentUserInfo = (): SettingUser | null => {
  const userInfo = localStorage.getItem(CURRENT_USER_INFO_KEY);
  if (!userInfo) {
    return null;
  }
  return JSON.parse(userInfo);
};

export default getCurrentUserInfo;
