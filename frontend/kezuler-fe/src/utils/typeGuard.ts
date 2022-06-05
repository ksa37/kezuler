import { BFixedEvent } from 'src/types/fixedEvent';

const isFixedEvent = (arg: any): arg is BFixedEvent => {
  return arg.eventTimeStartsAt !== undefined;
};

export { isFixedEvent };
