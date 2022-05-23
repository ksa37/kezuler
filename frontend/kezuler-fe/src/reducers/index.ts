import { combineReducers } from '@reduxjs/toolkit';

import AcceptMeeting from './AcceptMeeting';
import CreateMeeting from './CreateMeeting';
import modal from './modal';

const rootReducer = combineReducers({
  acceptMeeting: AcceptMeeting,
  createMeeting: CreateMeeting,
  modal: modal,
});

type RootState = ReturnType<typeof rootReducer>;

export type { RootState };
export default rootReducer;
