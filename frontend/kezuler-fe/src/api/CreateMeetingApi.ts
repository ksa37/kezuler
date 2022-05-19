import KezulerInstace from '../constants/api';
import PendingEvent from '../types/pendingEvent';

const postPendingMeetingApi = (pendingEvent: PendingEvent) =>
  KezulerInstace.post(`users/user0001/pendingEvents/`, {
    pendingEvent,
  });

export { postPendingMeetingApi };
