import { User } from 'src/types/user';

type TUserStatus = 'Accepted' | 'Declined' | 'Deleted';

interface FixedUser extends User {
  userStatus: TUserStatus;
}

interface BFixedEvent {
  addressDetail: string;
  addressType: string;
  disable: boolean;
  eventAttachment: string;
  eventDescription: string;
  eventHost: FixedUser;
  eventId: string;
  eventTimeDuration: number;
  eventTimeStartsAt: number;
  eventTitle: string;
  participants: FixedUser[];
  state: string;
}

interface FixedEvent extends BFixedEvent {
  userId: string;
}

// type PPatchFixedEvent = Partial<BFixedEvent>;

interface PPatchFixedEvent {
  eventTitle: string;
  eventDescription: string;
  addressType: string;
  addressDetail: string;
  eventAttachment: string;
}

// interface PGetFixedEvents {
//   startIndex: string;
//   endIndex: string;
// }

interface RGetFixedEvents {
  result: BFixedEvent[];
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
  // PGetFixedEvents,
  RGetFixedEvents,
  FixedEvent,
  PPatchFixedEvent,
  PPostFixedEvent,
  PPutFixedEvent,
  // PPatchFixedEvent2,
};
