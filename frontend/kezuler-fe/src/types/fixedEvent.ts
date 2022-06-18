import { User } from 'src/types/user';

type TUserStatus = 'Accepted' | 'Declined';

interface FixedUser extends User {
  userStatus: TUserStatus;
}

interface BFixedEvent {
  eventId: string;
  eventHost: FixedUser;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventZoomAddress: string;
  eventPlace: string;
  eventAttachment: string;
  eventTimeStartsAt: string;
  participants: FixedUser[];
  isDisabled: boolean; // 취소 여부
}

interface FixedEvent extends BFixedEvent {
  userId: string;
}

type PPatchFixedEvent = Partial<BFixedEvent>;

interface PGetFixedEvents {
  startIndex: string;
  endIndex: string;
}

interface RGetFixedEvents {
  userId: string;
  startIndex: number;
  endIndex: number;
  totalAmount: string;
  fixedEvents: BFixedEvent[];
}

//TODO: BE에 맞게 수정
interface PPostFixedEvent {
  pendingEventId: string;
  eventTimeStartsAt: number;
}

//TODO: BE에 맞게 수정
interface PPutFixedEvent {
  participants: string;
}

export type {
  FixedUser,
  BFixedEvent,
  PGetFixedEvents,
  RGetFixedEvents,
  FixedEvent,
  PPatchFixedEvent,
  PPostFixedEvent,
  PPutFixedEvent,
};
