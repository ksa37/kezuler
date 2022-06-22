interface BUser {
  userName: string;
  userProfileImage: string;
}

interface User extends BUser {
  userId: string;
}

// TODO Optional 하지 않게 변경해도 되는지 체크 필요
interface SettingUser extends User {
  userEmail?: string;
  userTimezone?: string;
  userKakaoId?: string;
  userGoogleCalendarId?: string;
}

type PPatchUser = Partial<SettingUser>;

interface UserToken {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
}

interface RPostUser extends SettingUser {
  userToken: UserToken;
}

export type { SettingUser, User, PPatchUser, RPostUser };
