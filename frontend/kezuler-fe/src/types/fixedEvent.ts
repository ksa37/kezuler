import { User } from 'src/types/user';

interface EventHost {
  userId: string;
  userName: string;
  userProfileImage: string;
}

interface BFixedEvent {
  eventId: string;
  eventHost: EventHost;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventZoomAddress: string | null;
  eventPlace: string;
  eventAttachment: string;
  eventTimeStartsAt: string;
  participants: User[];
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
};
