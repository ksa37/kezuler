interface PendingEvent {
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventTimeCandidates: EventTimeCandidate[];
  isEventOnline: boolean;
  eventZoomAddress: null | string;
  eventPlaceLongitude: number;
  eventPlaceLatitude: number;
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
