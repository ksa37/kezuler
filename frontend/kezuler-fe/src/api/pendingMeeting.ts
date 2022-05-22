import KezulerInstance from 'src/constants/api';
import {
  PendingEvent,
  PPatchPendingEvent,
  RGetPendingEvents,
} from 'src/types/pendingEvent';

const getPendingEvents = () =>
  KezulerInstance.get<RGetPendingEvents>('/pendingEvents');

const getPendingEventsById = (eventId: string) =>
  KezulerInstance.get<PendingEvent>(`/pendingEvents/${eventId}`);

const patchPendingEventsById = (eventId: string, params: PPatchPendingEvent) =>
  KezulerInstance.patch(`/pendingEvents/${eventId}`, {
    ...params,
  });

// const postPendingEvents = (userId: string) =>
//   KezulerInstance.post(`users/${userId}/pendingEvents`);

const postPendingEvent = (pendingEvent: PendingEvent) =>
  KezulerInstance.post<PendingEvent>(`users/user0001/pendingEvents`, {
    pendingEvent,
  });

const deletePendingEventById = (eventId: string) =>
  KezulerInstance.delete(`pendingEvents/${eventId}`);

export {
  getPendingEvents,
  getPendingEventsById,
  patchPendingEventsById,
  postPendingEvent,
  deletePendingEventById,
};
