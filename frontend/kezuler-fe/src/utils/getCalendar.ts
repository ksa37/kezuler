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

  const getCalendarByDate = (
    dateToGet: PGetCalendarByDay,
    dateKey: string,
    objToPut: ScehdulesEachDay
  ) => {
    return new Promise((resolve) => {
      getCalendars(dateToGet).then((res) => {
        const calendarList: RGetCalendars[] = res.data.result;
        const calendars = calendarList.map((schedule) => ({
          timeRange: schedule.isAllDay
            ? '하루 종일'
            : `${dateToDailyTime(new Date(schedule.start))} ~ ${dateToDailyTime(
                new Date(schedule.end)
              )}`,
          scheduleTitle: schedule.title,
        }));
        if (calendars.length) {
          objToPut[dateKey] = calendars;
        }
        resolve(objToPut);
      });
    });
  };

  const result = dateKeys.reduce<Promise<any>>((prevPromise, dateKey) => {
    const dateToGet: PGetCalendarByDay = {
      year: eventTimeList[dateKey][0].eventStartsAt.getFullYear(),
      month: Number(dateKey.split('/')[0]),
      day: Number(dateKey.split('/')[1].split(' ')[0]),
    };

    return prevPromise.then((res) => {
      return getCalendarByDate(dateToGet, dateKey, res);
    });
  }, Promise.resolve({}));

  const setCalendarStore = () =>
    result.then((res) => {
      dispatch(setCalendarList(res));
    });
  return { setCalendarStore };
};

export { getSchedules };
