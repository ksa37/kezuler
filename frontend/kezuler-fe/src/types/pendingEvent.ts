import { User } from 'src/types/user';

interface DeclinedUser extends User {
  userDeclineReason: string;
}

interface EventTimeCandidate {
  eventStartsAt: number;
  possibleUsers: User[];
}

interface BPendingEvent {
  eventId: string;
  eventHost: User;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  declinedUsers: DeclinedUser[];
  eventTimeCandidates: EventTimeCandidate[];
  eventZoomAddress: string;
  eventPlace: string;
  eventAttachment: string;
}

interface RGetPendingEvents {
  userId: string;
  pendingEvents: BPendingEvent[];
}

// TODO
interface PendingEvent extends BPendingEvent {
  userId?: string;
}

interface PPostPendingEvent {
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventTimeCandidates: number[];
  eventZoomAddress: string;
  eventPlace: string;
  eventAttachment: string;
}

interface PPutPendingEvent {
  eventTimeCandidates: string[];
  userDeclineReason?: string;
}

type PPatchPendingEvent = Partial<BPendingEvent>;

export type {
  DeclinedUser,
  BPendingEvent,
  PendingEvent,
  PPostPendingEvent,
  RGetPendingEvents,
  PPatchPendingEvent,
  PPutPendingEvent,
  EventTimeCandidate,
};
