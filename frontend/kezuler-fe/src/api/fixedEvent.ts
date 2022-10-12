import KezulerInstance from 'src/constants/api';
import {
  FixedEvent,
  PPatchFixedEvent,
  PPostFixedEvent,
  // PPutFixedEvent,
  RGetFixedEvents,
} from 'src/types/fixedEvent';
import { PPatchReminder, Reminder } from 'src/types/reminder';

const getFixedEvents = (page: number) =>
  KezulerInstance.get<RGetFixedEvents>(`fixedEvents?page=${page}`);

const getFixedEventById = (eventId: string) =>
  KezulerInstance.get<FixedEvent>(`/fixedEvents/${eventId}`);

const patchFixedEventById = (eventId: string, params: PPatchFixedEvent) =>
  KezulerInstance.patch<FixedEvent>(`/fixedEvents/${eventId}`, {
    ...params,
  });

// const patchFixedEventById2 = (eventId: string, params: PPatchFixedEvent2) =>
//   KezulerInstance.patch<FixedEvent>(`/fixedEvents/${eventId}`, {
//     ...params,
//   });

const postFixedEvent = (pfixedEvent: PPostFixedEvent) =>
  KezulerInstance.post<FixedEvent>(`/fixedEvents`, pfixedEvent);

const deleteFixedEventById = (eventId: string) =>
  KezulerInstance.delete<FixedEvent>(`/fixedEvents/${eventId}`);

// const putFixedEventGuestById = (eventId: string, pfixedEvent: PPutFixedEvent) =>
//   KezulerInstance.put<FixedEvent>(
//     `fixedEvents/${eventId}/candidate`,
//     pfixedEvent
//   );

const putFixedEventGuestById = (eventId: string) =>
  KezulerInstance.put<FixedEvent>(`fixedEvents/${eventId}/candidate`);

const cancelFixedEventGuestById = (eventId: string) =>
  KezulerInstance.patch<FixedEvent>(`fixedEvents/${eventId}/candidate`);

const deleteFixedEventGuestById = (eventId: string) =>
  KezulerInstance.delete<FixedEvent>(`fixedEvents/${eventId}/candidate`);

const cancelFixedEventHostById = (eventId: string) =>
  KezulerInstance.patch<FixedEvent>(`fixedEvents/${eventId}/host`);

const deleteFixedEventHostById = (eventId: string) =>
  KezulerInstance.delete<FixedEvent>(`fixedEvents/${eventId}/host`);

const getGuestReminder = (eventId: string) =>
  KezulerInstance.get<Reminder>(`fixedEvents/${eventId}/reminder`);

const patchGuestReminder = (eventId: string, param: PPatchReminder) =>
  KezulerInstance.patch(`fixedEvents/${eventId}/reminder`, param);

// const postGuestReminder = (eventId: string, param: PPutReminder) =>
//   KezulerInstance.post<Reminder>(`fixedEvents/${eventId}/reminder`, param);

// const putGuestReminder = (eventId: string, param: PPutReminder) =>
//   KezulerInstance.put<Reminder>(`fixedEvents/${eventId}/reminder`, param);

const deleteGuestReminder = (eventId: string) =>
  KezulerInstance.delete<Reminder>(`fixedEvents/${eventId}/reminder`);

export {
  getFixedEvents,
  getFixedEventById,
  patchFixedEventById,
  postFixedEvent,
  deleteFixedEventById,
  putFixedEventGuestById,
  deleteFixedEventGuestById,
  getGuestReminder,
  // postGuestReminder,
  // putGuestReminder,
  deleteGuestReminder,
  cancelFixedEventGuestById,
  cancelFixedEventHostById,
  deleteFixedEventHostById,
  patchGuestReminder,
};
