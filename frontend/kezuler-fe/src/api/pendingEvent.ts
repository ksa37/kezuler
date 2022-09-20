import KezulerInstance from 'src/constants/api';
import {
  PDeletePendingEvent,
  PPatchPendingEvent,
  PPostPendingEvent,
  PPutPendingEvent,
  RGetPendingEvents,
  RPendingEvent,
} from 'src/types/pendingEvent';

const getPendingEvents = () =>
  KezulerInstance.get<RGetPendingEvents>('/pendingEvents');

const getPendingEventById = (eventId: string) =>
  KezulerInstance.get<RPendingEvent>(`/pendingEvents/${eventId}`);

const patchPendingEventsById = (eventId: string, params: PPatchPendingEvent) =>
  KezulerInstance.patch(`/pendingEvents/${eventId}`, {
    ...params,
  });

const postPendingEvent = (ppendingEvent: PPostPendingEvent) =>
  KezulerInstance.post<RPendingEvent>(`pendingEvents`, ppendingEvent);

const deletePendingEventById = (eventId: string) =>
  KezulerInstance.delete(`pendingEvents/${eventId}`);

const putPendingEventGuestById = (
  eventId: string,
  ppendingEvent: PPutPendingEvent
) =>
  KezulerInstance.put<RPendingEvent>(
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

const cancelMeetingByGuest = (eventId: string) =>
  KezulerInstance.patch(`pendingEvents/${eventId}/candidate`);

// const deleteMeetingByGuest = (eventId: string) =>
//   KezulerInstance.delete(`events/guest/${eventId}`);

const cancelMeetingByHost = (eventId: string) =>
  KezulerInstance.patch(`pendingEvents/${eventId}/host`);

const deleteMeetingByHost = (eventId: string) =>
  KezulerInstance.delete(`pendingEvents/${eventId}/host`);

export {
  getPendingEvents,
  getPendingEventById,
  patchPendingEventsById,
  postPendingEvent,
  deletePendingEventById,
  putPendingEventGuestById,
  deletePendingEventGuestById,
  cancelMeetingByGuest,
  cancelMeetingByHost,
  deleteMeetingByHost,
};
