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
  eventZoomAddress: string | null;
  eventPlace: string;
  eventAttachment: string;
  eventTimeStartsAt: string;
  participants: EventParticipant[];
  isDisabled: boolean; // 취소 여부
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
  EventParticipant,
};
