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
  addressType: string;
  addressDetail: string;
  eventAttachment: string;
  disable: boolean;
}

interface RGetPendingEvents {
  result: BPendingEvent[];
}

// TODO
interface PendingEvent extends BPendingEvent {
  userId?: string;
}
interface RPendingEvent {
  result: PendingEvent;
}

interface PPostPendingEvent {
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventTimeCandidates: number[];
  addressType: string;
  addressDetail: string;
  eventAttachment: string;
}

interface PPutPendingEvent {
  addTimeCandidates?: number[];
  removeTimeCandidates?: number[];
}

interface PDeletePendingEvent {
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
  PDeletePendingEvent,
  EventTimeCandidate,
  RPendingEvent,
};
