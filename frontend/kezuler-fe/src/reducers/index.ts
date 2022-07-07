import { combineReducers } from '@reduxjs/toolkit';

import AcceptMeeting from './AcceptMeeting';
import ConfirmTime from './ConfirmTime';
import CreateMeeting from './CreateMeeting';
import dialog from './dialog';
import mainFixed from './mainFixed';
import mainPending from './mainPending';
import participantsPopup from './ParticipantsPopup';
import userInfo from './UserInfo';

const rootReducer = combineReducers({
  acceptMeeting: AcceptMeeting,
  createMeeting: CreateMeeting,
  mainFixed: mainFixed,
  mainPending: mainPending,
  userInfo: userInfo,
  dialog: dialog,
  participantsPopup: participantsPopup,
  confirmTime: ConfirmTime,
});

type RootState = ReturnType<typeof rootReducer>;

export type { RootState };
export default rootReducer;
