const REMINDER_OPTIONS = [
  { display: '안함', hours: 0 },
  { display: '1시간 전', hours: 1 },
  { display: '하루 전', hours: 24 },
  { display: '일주일 전', hours: 168 },
];

const PLACE_OPTIONS = [
  { display: '온라인', isOnline: true },
  { display: '오프라인', isOnline: false },
];

const FIXED_TODAY_ID = 'fixed-event-card-today';

const OVERVIEW_FORM_ID = 'overview-form';

export { REMINDER_OPTIONS, PLACE_OPTIONS, FIXED_TODAY_ID, OVERVIEW_FORM_ID };
