import { combineReducers } from '@reduxjs/toolkit';

import AcceptMeeting from './AcceptMeeting';
import CreateMeeting from './CreateMeeting';
import dialog from './dialog';
import mainFixed from './mainFixed';
import mainPending from './mainPending';
import modal from './modal';
import userInfo from './UserInfo';

const rootReducer = combineReducers({
  acceptMeeting: AcceptMeeting,
  createMeeting: CreateMeeting,
  mainFixed: mainFixed,
  mainPending: mainPending,
  userInfo: userInfo,
  modal: modal,
  dialog: dialog,
});

type RootState = ReturnType<typeof rootReducer>;

export type { RootState };
export default rootReducer;
