const PathName = {
  login: '/login',
  main: '/main',
  notification: '/noti',
  myPage: '/mypage',
  pending: '/pending',
  delete: '/delete',
  create: '/create',
  invite: '/invite',
  share: '/share',
  modify: '/modify',
  confirm: '/confirm',

  kakaoRedirect: '/oauth/kakao/token',
} as const;
type PathName = typeof PathName[keyof typeof PathName];

export default PathName;
