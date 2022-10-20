import { useDispatch } from 'react-redux';

import { calendarAction } from 'src/reducers/calendarList';
import { AppDispatch } from 'src/store';
import {
  PGetCalendarByDay,
  RGetCalendars,
  ScehdulesEachDay,
} from 'src/types/calendar';

import { dateToDailyTime } from './dateParser';

import { getCalendars } from 'src/api/calendar';

interface EventTimeListWithPossibleNum {
  eventStartsAt: Date;
  possibleNum: number;
}

type EventTimeListByDateWithPossibleNum = {
  [date: string]: EventTimeListWithPossibleNum[];
};

const getSchedules = (eventTimeList: EventTimeListByDateWithPossibleNum) => {
  const dispatch = useDispatch<AppDispatch>();
  const dateKeys = Object.keys(eventTimeList);
  const { setCalendarList } = calendarAction;

  const dateToGetList = dateKeys.map((dateKey) => {
    const dateToGet: PGetCalendarByDay = {
      year: eventTimeList[dateKey][0].eventStartsAt.getFullYear(),
      month: Number(dateKey.split('/')[0]),
      day: Number(dateKey.split('/')[1].split(' ')[0]),
    };
    return getCalendars(dateToGet);
  });

  const setCalendarStore = () =>
    Promise.all(dateToGetList).then((res) => {
      const schedules = res.map((item) => {
        const calendarList: RGetCalendars[] = item.data.result;
        const calendars = calendarList.map((schedule) => ({
          timeRange: schedule.isAllDay
            ? '하루 종일'
            : `${dateToDailyTime(new Date(schedule.start))} ~ ${dateToDailyTime(
                new Date(schedule.end)
              )}`,
          scheduleTitle: schedule.title,
        }));
        return calendars;
      });
      const schedulesEachDay: ScehdulesEachDay = {};
      dateKeys.map((dateKey, index) => {
        schedulesEachDay[dateKey] = schedules[index];
      });
      dispatch(setCalendarList(schedulesEachDay));
    });

  return { setCalendarStore };
};

export { getSchedules };
