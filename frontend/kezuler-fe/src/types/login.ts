interface RKakaoAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

interface RGoogleAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

interface PPostGoogleToken {
  accessToken: string;
  refreshToken: string;
}

export type { RKakaoAccessToken, RGoogleAccessToken, PPostGoogleToken };
