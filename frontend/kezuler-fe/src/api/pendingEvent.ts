import KezulerInstance from 'src/constants/api';
import {
  PDeletePendingEvent,
  PendingEvent,
  PPatchPendingEvent,
  PPostPendingEvent,
  PPutPendingEvent,
  RGetPendingEvents,
} from 'src/types/pendingEvent';

const getPendingEvents = () =>
  KezulerInstance.get<RGetPendingEvents>('/pendingEvents');

const getPendingEventById = (eventId: string) =>
  KezulerInstance.get<PendingEvent>(`/pendingEvents/${eventId}`);

const patchPendingEventsById = (eventId: string, params: PPatchPendingEvent) =>
  KezulerInstance.patch(`/pendingEvents/${eventId}`, {
    ...params,
  });

const postPendingEvent = (ppendingEvent: PPostPendingEvent) =>
  KezulerInstance.post<PendingEvent>(`pendingEvents`, ppendingEvent);

const deletePendingEventById = (eventId: string) =>
  KezulerInstance.delete(`pendingEvents/${eventId}`);

const putPendingEventGuestById = (
  eventId: string,
  ppendingEvent: PPutPendingEvent
) =>
  KezulerInstance.put<PendingEvent>(
    `pendingEvents/${eventId}/candidate`,
    ppendingEvent
  );

const deletePendingEventGuestById = (
  eventId: string,
  ppendingEvent?: PDeletePendingEvent
) => {
  const config = {
    data: ppendingEvent,
  };
  KezulerInstance.delete(`pendingEvents/${eventId}/candidate`, config);
};
export {
  getPendingEvents,
  getPendingEventById,
  patchPendingEventsById,
  postPendingEvent,
  deletePendingEventById,
  putPendingEventGuestById,
  deletePendingEventGuestById,
};
