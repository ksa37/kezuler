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
  eventTimeCandidates: EventTimeCandidate[];
  isEventOnline: boolean;
  eventZoomAddress: null | string;
  eventPlaceLongitude: null | number;
  eventPlaceLatitude: null | number;
  eventAttachment: string;
}

interface PossibleUser {
  userId: string;
  userImage: string;
}

interface EventTimeWithUser {
  eventStartsAt: string;
  possbileUsers: PossibleUser[];
}

type EventTimeCandidate = Record<string, EventTimeWithUser[]>;

export default PendingEvent;
export { UserPendingEvents, PossibleUser };
