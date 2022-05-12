const PathName = {
  login: '/login',
  main: '/main',
  notification: '/noti',
  setting: '/setting',
  pending: '/pending',
  delete: '/delete',
  create: '/create',
  invite: '/invite',

  kakaoRedirect: '/oauth/kakao/token',
} as const;
type PathName = typeof PathName[keyof typeof PathName];

export default PathName;
