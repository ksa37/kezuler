import KezulerInstance from 'src/constants/api';
import {
  FixedEvent,
  PPatchFixedEvent,
  PPostFixedEvent,
  RGetFixedEvents,
} from 'src/types/fixedEvent';
import { PPatchReminder, Reminder } from 'src/types/reminder';

const getFixedEvents = (page: number) =>
  KezulerInstance.get<RGetFixedEvents>(`fixedEvents?page=${page}`);

const getFixedEventById = (eventId: string) =>
  KezulerInstance.get<FixedEvent>(`/fixedEvents/${eventId}`);

const postFixedEvent = (pfixedEvent: PPostFixedEvent) =>
  KezulerInstance.post<FixedEvent>(`/fixedEvents`, pfixedEvent);

const patchFixedEventById = (eventId: string, params: PPatchFixedEvent) =>
  KezulerInstance.patch<FixedEvent>(`/fixedEvents/${eventId}`, {
    ...params,
  });

//Candidate

const putFixedEventGuestById = (eventId: string) =>
  KezulerInstance.put<FixedEvent>(`fixedEvents/${eventId}/candidate`);

const cancelFixedEventGuestById = (eventId: string) =>
  KezulerInstance.patch<FixedEvent>(`fixedEvents/${eventId}/candidate`);

const deleteFixedEventGuestById = (eventId: string) =>
  KezulerInstance.delete<FixedEvent>(`fixedEvents/${eventId}/candidate`);

//Host

const cancelFixedEventHostById = (eventId: string) =>
  KezulerInstance.patch<FixedEvent>(`fixedEvents/${eventId}/host`);

const deleteFixedEventHostById = (eventId: string) =>
  KezulerInstance.delete<FixedEvent>(`fixedEvents/${eventId}/host`);

//Reminder

const getGuestReminder = (eventId: string) =>
  KezulerInstance.get<Reminder>(`fixedEvents/${eventId}/reminder`);

const patchGuestReminder = (eventId: string, param: PPatchReminder) =>
  KezulerInstance.patch(`fixedEvents/${eventId}/reminder`, param);

// Currently not using
const deleteGuestReminder = (eventId: string) =>
  KezulerInstance.delete<Reminder>(`fixedEvents/${eventId}/reminder`);

export {
  getFixedEvents,
  getFixedEventById,
  patchFixedEventById,
  postFixedEvent,
  putFixedEventGuestById,
  deleteFixedEventGuestById,
  getGuestReminder,
  deleteGuestReminder,
  cancelFixedEventGuestById,
  cancelFixedEventHostById,
  deleteFixedEventHostById,
  patchGuestReminder,
};
