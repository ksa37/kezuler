import KezulerInstance from 'src/constants/api';
import {
  FixedEvent,
  PGetFixedEvents,
  PPatchFixedEvent,
  PPostFixedEvent,
  // PPutFixedEvent,
  RGetFixedEvents,
} from 'src/types/fixedEvent';

const getFixedEvents = ({ startIndex, endIndex }: PGetFixedEvents) =>
  KezulerInstance.get<RGetFixedEvents>(`fixedEvents`, {
    params: { startIndex, endIndex },
  });

const getFixedEventById = (eventId: string) =>
  KezulerInstance.get<FixedEvent>(`/fixedEvents/${eventId}`);

const patchFixedEventById = (eventId: string, params: PPatchFixedEvent) =>
  KezulerInstance.patch<FixedEvent>(`/fixedEvents/${eventId}`, {
    ...params,
  });

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

const deleteFixedEventGuestById = (eventId: string) =>
  KezulerInstance.delete<FixedEvent>(`fixedEvents/${eventId}/candidate`);

export {
  getFixedEvents,
  getFixedEventById,
  patchFixedEventById,
  postFixedEvent,
  deleteFixedEventById,
  putFixedEventGuestById,
  deleteFixedEventGuestById,
};
