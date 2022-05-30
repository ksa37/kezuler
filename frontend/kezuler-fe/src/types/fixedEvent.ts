interface EventParticipant {
  userId: string;
  userProfileImage: string;
}

interface BFixedEvent {
  eventHostId: string;
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

interface PGetFixedEvents {
  startIndex: number;
  endIndex: number;
}

interface RGetFixedEvents {
  userId: string;
  startIndex: number;
  endIndex: number;
  totalAmount: string;
  fixedEvents: BFixedEvent[];
}

export type {
  BFixedEvent,
  PGetFixedEvents,
  RGetFixedEvents,
  FixedEvent,
  PPatchFixedEvent,
};
