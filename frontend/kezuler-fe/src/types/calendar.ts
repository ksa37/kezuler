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

export type { PGetCalendarByDay, RGetCalendars, ScehdulesEachDay };
