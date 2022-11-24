const PathName = {
  login: '/login',
  main: '/main',
  notification: '/noti',
  landing: '/landing',

  myPage: '/mypage',
  privacyPolicy: '/mypage/privacy-policy',
  serviceTerm: '/mypage/service-term',

  pending: '/pending',

  mainFixed: '/main/fixed',
  mainFixedB: '/main/fixed/B',
  mainFixedIdInfo: '/main/fixed/:eventId/info',
  mainFixedIdInfoParticipants: '/main/fixed/:eventId/info/participants',
  mainFixedIdInfoEdit: '/main/fixed/:eventId/info-edit',
  mainPending: '/main/pending',
  mainPendingIdInfo: '/main/pending/:eventId/info',
  mainPendingIdInfoEdit: '/main/pending/:eventId/info-edit',
  mainPendingIdParticipants: '/main/pending/:eventId/participants',

  create: '/create',
  createInfo: '/create/info',
  createTime: '/create/time',
  createTimeA: '/create/time/A',
  createTimeB: '/create/time/B',
  createCheck: '/create/check',
  createPlace: '/create/place',
  createComplete: '/create/complete',

  invite: '/invite',
  inviteInvitation: '/invite/:eventId/invitation',
  inviteSelect: '/invite/:eventId/select',
  inviteSelectParticipants: '/invite/:eventId/select/participants',
  inviteComplete: '/invite/:eventId/complete',

  modify: '/modify/:eventId',
  modifyParticipants: '/modify/:eventId/participants',
  confirm: '/confirm',
  confirmParticipants: '/confirm/participants',

  kakaoRedirect: '/oauth/kakao/token',

  storage: '/storage',
  storageTypeSelect: '/storage/:eventId/type',
  storageMemoWrite: '/storage/:eventId/memo',
  storageMemoEdit: '/storage/:eventId/memo/:id/edit',
  storageMemo: '/storage/:eventId/memo/:id',

  storageLinkWrite: '/storage/:eventId/link',
  storageLink: '/storage/:eventId/link/:id',

  storageTitle: '/storage/:eventId/:type/title',

  notFound: '/notfound',
} as const;
type PathName = typeof PathName[keyof typeof PathName];

const PathNameList = [
  '/login',
  '/main',
  '/noti',
  '/landing',

  '/mypage',
  '/mypage/privacy-policy',
  '/mypage/service-term',

  '/pending',

  '/main/fixed',
  '/main/fixed/B',
  /\/main\/fixed\/.+\/info/,
  /\/main\/fixed\/.+\/info-edit/,
  '/main/pending',
  /\/main\/pending\/.+\/info/,
  /\/main\/pending\/.+\/info-edit/,

  '/delete',

  '/create',
  '/create/info',
  '/create/time',
  '/create/time/A',
  '/create/time/B',
  '/create/check',
  '/create/place',
  '/create/complete',

  '/invite',
  /\/invite\/.+\/invitation/,
  /\/invite\/.+\/select/,
  /\/invite\/.+\/complete/,

  /\/modify\/.+/,
  /\/confirm\/.+/,
  '/oauth/kakao/token',
];

// TODO util 로?
const makePendingInfoUrl = (eventId: string, isEdit?: boolean) =>
  `${PathName.mainPending}/${eventId}/info${isEdit ? '-edit' : ''}`;

const makeFixedInfoUrl = (eventId: string, isEdit?: boolean) =>
  `${PathName.mainFixed}/${eventId}/info${isEdit ? '-edit' : ''}`;

export { PathNameList, makePendingInfoUrl, makeFixedInfoUrl };
export default PathName;
