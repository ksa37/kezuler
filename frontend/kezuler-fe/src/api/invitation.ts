import KezulerInstance from 'src/constants/api';
import { PendingEvent } from 'src/types/pendingEvent';

const getInvitationById = (eventId: string) =>
  KezulerInstance.get<PendingEvent>(`/pendingEvents/${eventId}/invitation`);

export { getInvitationById };
