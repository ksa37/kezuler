import KezulerInstance from 'src/constants/api';
import {
  PendingEvent,
  PPatchPendingEvent,
  PPostPendingEvent,
  PPutPendingEvent,
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

const putPendingEventGuestById = (
  eventId: string,
  ppendingEvent: PPutPendingEvent
) =>
  KezulerInstance.put<PendingEvent>(`pendingEvents/${eventId}/candidate`, {
    ppendingEvent,
  });

const deletePendingEventGuestById = (eventId: string) =>
  KezulerInstance.delete(`pendingEvents/${eventId}/candidate`);

export {
  getPendingEvents,
  getPendingEventsById,
  patchPendingEventsById,
  postPendingEvent,
  deletePendingEventById,
  putPendingEventGuestById,
  deletePendingEventGuestById,
};
