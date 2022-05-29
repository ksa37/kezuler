import { combineReducers } from '@reduxjs/toolkit';

import AcceptMeeting from './AcceptMeeting';
import CreateMeeting from './CreateMeeting';
import mainFixed from './mainFixed';
import mainPending from './mainPending';
import modal from './modal';

const rootReducer = combineReducers({
  acceptMeeting: AcceptMeeting,
  createMeeting: CreateMeeting,
  mainFixed: mainFixed,
  mainPending: mainPending,
  modal: modal,
});

type RootState = ReturnType<typeof rootReducer>;

export type { RootState };
export default rootReducer;
