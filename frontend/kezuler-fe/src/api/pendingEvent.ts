import KezulerInstance from 'src/constants/api';
import {
  PendingEvent,
  PPatchPendingEvent,
  PPostPendingEvent,
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

const postPendingEvent = (ppendingEvent: PPostPendingEvent) =>
  KezulerInstance.post<PendingEvent>(`pendingEvents`, {
    ppendingEvent,
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
