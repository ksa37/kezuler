const PathName = {
  login: '/login',
  main: '/main',
  notification: '/noti',
  myPage: '/mypage',
  pending: '/pending',
  mainFixed: '/main/fixed',
  mainFixedIdInfo: '/main/fixed/:eventId/info',
  mainFixedIdInfoEdit: '/main/fixed/:eventId/info-edit',
  mainPending: '/main/pending',
  mainPendingIdInfo: '/main/pending/:eventId/info',
  mainPendingIdInfoEdit: '/main/pending/:eventId/info-edit',
  delete: '/delete',
  create: '/create',
  createInfo: '/create/info',
  createTime: '/create/time',
  createCheck: '/create/check',
  createPlace: '/create/place',
  createComplete: '/create/complete',
  invite: '/invite',
  modify: '/modify',
  confirm: '/confirm',

  kakaoRedirect: '/oauth/kakao/token',
} as const;
type PathName = typeof PathName[keyof typeof PathName];

// TODO util 로?
const makePendingInfoUrl = (eventId: string, isEdit?: boolean) =>
  `${PathName.mainPending}/${eventId}/info${isEdit ? '-edit' : ''}`;

const makeFixedInfoUrl = (eventId: string, isEdit?: boolean) =>
  `${PathName.mainFixed}/${eventId}/info${isEdit ? '-edit' : ''}`;

export { makePendingInfoUrl, makeFixedInfoUrl };
export default PathName;
