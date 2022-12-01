import { User } from 'src/types/user';

interface DeclinedUser extends User {
  userDeclineReason: string;
}

interface EventTimeCandidate {
  eventStartsAt: number;
  possibleUsers: User[];
}

interface BPendingEvent {
  eventId: string;
  eventHost: User;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  declinedUsers: DeclinedUser[];
  eventTimeCandidates: EventTimeCandidate[];
  addressType: string;
  addressDetail: string;
  eventAttachment: string;
  disable: boolean;
  state: string;
}

interface RGetPendingEvents {
  result: BPendingEvent[];
}

// TODO
interface PendingEvent extends BPendingEvent {
  userId?: string;
}
interface RPendingEvent {
  result: PendingEvent;
}

// TODO addressType 의 type 을 더 확실하게 잡으면 좋을 것 같음
// 'ON' | 'OFF' 밖에 쓰이지 않는 것으로 보임
interface PPostPendingEvent {
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventTimeCandidates: number[];
  addressType: string;
  addressDetail: string;
  eventAttachment: string;
}

interface PPutPendingEvent {
  addTimeCandidates?: number[];
  // removeTimeCandidates?: number[];
}

interface PDeletePendingEvent {
  userDeclineReason?: string;
}

type PPatchPendingEvent = Partial<BPendingEvent>;

export type {
  DeclinedUser,
  BPendingEvent,
  PendingEvent,
  PPostPendingEvent,
  RGetPendingEvents,
  PPatchPendingEvent,
  PPutPendingEvent,
  PDeletePendingEvent,
  EventTimeCandidate,
  RPendingEvent,
};
