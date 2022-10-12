import { combineReducers } from '@reduxjs/toolkit';

import AcceptMeeting from './AcceptMeeting';
import alert from './alert';
import calendarList from './calendarList';
import ConfirmTime from './ConfirmTime';
import CreateMeeting from './CreateMeeting';
import dialog from './dialog';
import mainFixed from './mainFixed';
import mainPending from './mainPending';
import noti from './noti';
import participantsPopup from './ParticipantsPopup';
import share from './share';
import userInfo from './UserInfo';

const rootReducer = combineReducers({
  acceptMeeting: AcceptMeeting,
  createMeeting: CreateMeeting,
  mainFixed: mainFixed,
  mainPending: mainPending,
  userInfo: userInfo,
  dialog: dialog,
  alert: alert,
  noti: noti,
  share: share,
  participantsPopup: participantsPopup,
  confirmTime: ConfirmTime,
  calendarList: calendarList,
});

type RootState = ReturnType<typeof rootReducer>;

export type { RootState };
export default rootReducer;
