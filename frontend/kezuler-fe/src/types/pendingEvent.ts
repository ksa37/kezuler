interface DeclinedUser {
  userId: string;
  userProfileImage: string;
  userDeclineReason: string;
}

interface PossibleUser {
  userId: string;
  userProfileImage: string;
}

interface EventTimeWithUser {
  eventStartsAt: string;
  possibleUsers: PossibleUser[];
}

type EventTimeCandidate = { [date: string]: EventTimeWithUser[] };

interface BPendingEvent {
  eventHostId: string;
  eventId: string;
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
  userId: string;
}

type PPatchPendingEvent = Partial<BPendingEvent>;

export type {
  BPendingEvent,
  PendingEvent,
  RGetPendingEvents,
  PossibleUser,
  EventTimeCandidate,
  PPatchPendingEvent,
};
