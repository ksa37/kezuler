import { combineReducers } from '@reduxjs/toolkit';

import AcceptMeeting from './AcceptMeeting';
import CreateMeeting from './CreateMeeting';

const rootReducer = combineReducers({
  acceptMeeting: AcceptMeeting,
  createMeeting: CreateMeeting,
});

type RootState = ReturnType<typeof rootReducer>;

export type { RootState };
export default rootReducer;
