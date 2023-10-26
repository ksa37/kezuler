interface PGetCalendarByDay {
  year: number;
  month: number;
  day: number;
}

interface RGetCalendars {
  start: number;
  isAllDay: boolean;
  end: number;
  title: string;
}

type Schedule = {
  timeRange: string;
  scheduleTitle: string;
};

interface ScehdulesEachDay {
  [dateString: string]: Schedule[];
}

interface EventTimeListWithPossibleNum {
  eventStartsAt: Date;
  possibleNum: number;
}

type EventTimeListByDateWithPossibleNum = {
  [date: string]: EventTimeListWithPossibleNum[];
};

type EventTimeListByDate = { [date: string]: Date[] };

export type {
  PGetCalendarByDay,
  RGetCalendars,
  ScehdulesEachDay,
  EventTimeListByDateWithPossibleNum,
  EventTimeListByDate,
  EventTimeListWithPossibleNum,
};
