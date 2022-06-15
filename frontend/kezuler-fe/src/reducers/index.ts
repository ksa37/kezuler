import { combineReducers } from '@reduxjs/toolkit';

import AcceptMeeting from './AcceptMeeting';
import ConfirmTime from './ConfirmTime';
import CreateMeeting from './CreateMeeting';
import dialog from './dialog';
import mainFixed from './mainFixed';
import mainPending from './mainPending';
import modal from './modal';
import ModifySelection from './ModifySelection';
import participantsPopup from './ParticipantsPopup';
import userInfo from './UserInfo';

const rootReducer = combineReducers({
  acceptMeeting: AcceptMeeting,
  createMeeting: CreateMeeting,
  modifySelection: ModifySelection,
  mainFixed: mainFixed,
  mainPending: mainPending,
  userInfo: userInfo,
  modal: modal,
  dialog: dialog,
  participantsPopup: participantsPopup,
  confirmTime: ConfirmTime,
});

type RootState = ReturnType<typeof rootReducer>;

export type { RootState };
export default rootReducer;
