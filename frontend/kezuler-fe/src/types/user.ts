interface User {
  userId: string;
  userName: string;
  userProfileImage?: string;
  canceled?: boolean;
}

// TODO Optional 하지 않게 변경해도 되는지 체크 필요
interface SettingUser extends User {
  googleToggle: boolean;
  userEmail: string;
  userKakaoId: string;
  userPhoneNumber?: string;
  userTimezone: string;
  userGoogleCalendarId?: string;
}

interface RSettingUser {
  result: SettingUser;
}

// type ChangeTypeOfKeys<T extends object, Keys extends keyof T, NewType> = {
//   [key in keyof T]: key extends Keys ? NewType : T[key];
// };

// type PPatchUser = ChangeTypeOfKeys<
//   Partial<SettingUser>,
//   'userProfileImage',
//   File
// >;

// type PPatchUserExceptProfileImage = Pick<
//   Partial<SettingUser>,
//   Exclude<keyof SettingUser, 'userProfileImage'>
// >;

interface PPatchUserProfile {
  userName: string;
  userEmail: string;
  profile: File | null;
}

interface PPatchUserTimezone {
  timeZone: string;
}

interface PPatchUserGoogleToggle {
  googleToggle: boolean;
}

interface UserToken {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  tokenType: string;
}

interface RRPostUser extends SettingUser {
  userToken: UserToken;
}

// interface RPostUser extends SettingUser {
//   userToken: UserToken;
// }

interface RPostUser {
  result: RRPostUser;
}

export type {
  SettingUser,
  RSettingUser,
  User,
  RPostUser,
  // RPostUser2,
  PPatchUserTimezone,
  PPatchUserGoogleToggle,
  PPatchUserProfile,
};
