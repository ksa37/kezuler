import KezulerInstance from 'src/constants/api';
import {
  FixedEvent,
  PPatchFixedEvent,
  RGetFixedEvents,
} from '../types/fixedEvent';

const getFixedEvents = (userId: string, startIndex: number, endIndex: number) =>
  KezulerInstance.get<RGetFixedEvents>(`users/${userId}/fixedEvents`, {
    data: {
      startIndex,
      endIndex,
    },
  });

const getFixedEventById = (userId: string, eventId: string) =>
  KezulerInstance.get<FixedEvent>(`users/${userId}/fixedEvents/${eventId}`);

const patchFixedEventById = (
  userId: string,
  eventId: string,
  params: PPatchFixedEvent
) =>
  KezulerInstance.patch<FixedEvent>(`users/${userId}/fixedEvents/${eventId}`, {
    ...params,
  });

const postFixedEvents = (userId: string) =>
  KezulerInstance.post<FixedEvent>(`users/${userId}/fixedEvents`);

const deleteFixedEventById = (userId: string, eventId: string) =>
  KezulerInstance.delete<FixedEvent>(`users/${userId}/fixedEvents/${eventId}`);

export {
  getFixedEvents,
  getFixedEventById,
  patchFixedEventById,
  postFixedEvents,
  deleteFixedEventById,
};
