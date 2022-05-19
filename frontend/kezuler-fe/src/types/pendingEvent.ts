interface UserPendingEvents {
  userId: string;
  pendingEvents: PendingEvent[];
}

interface PendingEvent {
  userId?: string;
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  declinedUsers: null | DeclinedUser[];
  eventTimeCandidates: null | EventTimeCandidate[];
  eventZoomAddress: null | string;
  eventPlace: null | string;
  eventAttachment: string;
}

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
// Record<string, EventTimeWithUser[]>;

export default PendingEvent;
export type { UserPendingEvents, PossibleUser, EventTimeCandidate };
