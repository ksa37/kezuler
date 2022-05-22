interface EventParticipant {
  userId: string;
  userProfileImage: string;
}

interface BFixedEvent {
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventTimeStartsAt: string;
  eventZoomAddress: string | null;
  eventPlace: string;
  eventAttachment: string;
  participants: EventParticipant[];
  isDisabled: boolean;
}

interface FixedEvent extends BFixedEvent {
  userId: string;
}

type PPatchFixedEvent = Partial<BFixedEvent>;

interface RGetFixedEvents {
  userId: string;
  startDate: string;
  endDate: string;
  fixedEvents: BFixedEvent[];
}

export type { RGetFixedEvents, FixedEvent, PPatchFixedEvent };
