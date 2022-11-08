import KezulerInstance from 'src/constants/api';
import {
  PDeletePendingEvent,
  PPatchPendingEvent,
  PPostPendingEvent,
  PPutPendingEvent,
  RGetPendingEvents,
  RPendingEvent,
} from 'src/types/pendingEvent';

const getPendingEvents = (page: number) =>
  KezulerInstance.get<RGetPendingEvents>(`/pendingEvents?page=${page}`);

const getPendingEventById = (eventId: string) =>
  KezulerInstance.get<RPendingEvent>(`/pendingEvents/${eventId}`);

const postPendingEvent = (ppendingEvent: PPostPendingEvent) =>
  KezulerInstance.post<RPendingEvent>(`pendingEvents`, ppendingEvent);

const patchPendingEventById = (eventId: string, params: PPatchPendingEvent) =>
  KezulerInstance.patch(`/pendingEvents/${eventId}`, {
    ...params,
  });

// Candidate

const putPendingEventCandidateById = (
  eventId: string,
  ppendingEvent: PPutPendingEvent
) =>
  KezulerInstance.put<RPendingEvent>(
    `pendingEvents/${eventId}/candidate`,
    ppendingEvent
  );

const deletePendingEventCandidateById = (
  eventId: string,
  ppendingEvent?: PDeletePendingEvent
) => {
  const config = {
    data: ppendingEvent,
  };
  return KezulerInstance.delete<RPendingEvent>(
    `pendingEvents/${eventId}/candidate`,
    config
  );
};

const cancelPendingEventGuestById = (eventId: string) =>
  KezulerInstance.patch(`pendingEvents/${eventId}/candidate`);

// Host

const cancelPendingEventHostById = (eventId: string) =>
  KezulerInstance.patch(`pendingEvents/${eventId}/host`);

const deletePendingEventHostById = (eventId: string) =>
  KezulerInstance.delete(`pendingEvents/${eventId}/host`);

export {
  getPendingEvents,
  getPendingEventById,
  patchPendingEventById,
  postPendingEvent,
  putPendingEventCandidateById,
  deletePendingEventCandidateById,
  cancelPendingEventGuestById,
  cancelPendingEventHostById,
  deletePendingEventHostById,
};
