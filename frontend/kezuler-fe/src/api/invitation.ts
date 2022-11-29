import KezulerInstance from 'src/constants/api';
import { RGetFixedEvent } from 'src/types/fixedEvent';
import { RPendingEvent } from 'src/types/pendingEvent';

const getInvitationById = (eventId: string) =>
  KezulerInstance.get<RPendingEvent | RGetFixedEvent>(`/invitation/${eventId}`);

export { getInvitationById };
