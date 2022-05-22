interface BUser {
  userName: string;
  userPhoneNumber: string;
  userProfileImage: string;
}

interface User extends BUser {
  userId: string;
}

type PPatchUser = Partial<BUser>;

interface UserToken {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
}

interface RPostUser extends User {
  userToken: UserToken;
}

export type { User, PPatchUser, RPostUser };
