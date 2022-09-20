import KezulerInstance from 'src/constants/api';
import { RPendingEvent } from 'src/types/pendingEvent';

const getInvitationById = (eventId: string) =>
  KezulerInstance.get<RPendingEvent>(`/pendingEvents/invitation/${eventId}`);

export { getInvitationById };
