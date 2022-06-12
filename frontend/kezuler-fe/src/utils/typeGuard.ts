import { BFixedEvent } from 'src/types/fixedEvent';
import { DeclinedUser } from 'src/types/pendingEvent';

const isFixedEvent = (arg: any): arg is BFixedEvent => {
  return arg?.eventTimeStartsAt !== undefined;
};

const isDeclinedUser = (user: any): user is DeclinedUser =>
  user?.userDeclineReason !== undefined;

export { isFixedEvent, isDeclinedUser };
