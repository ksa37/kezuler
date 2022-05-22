import KezulerInstance from 'src/constants/api';
import {
  FixedMeeting,
  PPatchFixedEvent,
  RGetFixedEvents,
} from '../types/fixedMeeting';

const getFixedEvents = (userId: string, startIndex: number, endIndex: number) =>
  KezulerInstance.get<RGetFixedEvents>(`users/${userId}/fixedEvents`, {
    data: {
      startIndex,
      endIndex,
    },
  });

const getFixedEventById = (userId: string, eventId: string) =>
  KezulerInstance.get<FixedMeeting>(`users/${userId}/fixedEvents/${eventId}`);

const patchFixedEventById = (
  userId: string,
  eventId: string,
  params: PPatchFixedEvent
) =>
  KezulerInstance.patch<FixedMeeting>(
    `users/${userId}/fixedEvents/${eventId}`,
    {
      ...params,
    }
  );

const postFixedEvents = (userId: string) =>
  KezulerInstance.post<FixedMeeting>(`users/${userId}/fixedEvents`);

const deleteFixedEventById = (userId: string, eventId: string) =>
  KezulerInstance.delete<FixedMeeting>(
    `users/${userId}/fixedEvents/${eventId}`
  );

export {
  getFixedEvents,
  getFixedEventById,
  patchFixedEventById,
  postFixedEvents,
  deleteFixedEventById,
};
