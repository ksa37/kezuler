import { useDispatch } from 'react-redux';

import { calendarActions } from 'src/reducers/calendarList';
import { AppDispatch } from 'src/store';
import {
  EventTimeListByDate,
  EventTimeListByDateWithPossibleNum,
  PGetCalendarByDay,
  RGetCalendars,
  ScehdulesEachDay,
} from 'src/types/calendar';

import { dateToDailyTime } from './dateParser';

import { getCalendars } from 'src/api/calendar';

const isEventTimeListByDateWithNum = (
  eventTimeList: any
): eventTimeList is EventTimeListByDateWithPossibleNum => {
  return (
    eventTimeList[Object.keys(eventTimeList)[0]]?.[0]?.eventStartsAt !==
    undefined
  );
};

const getSchedules = (
  eventTimeList: EventTimeListByDateWithPossibleNum | EventTimeListByDate
) => {
  const dispatch = useDispatch<AppDispatch>();
  const dateKeys = Object.keys(eventTimeList);
  const { setCalendarList, setCalendarLoaded } = calendarActions;

  const isWithNum = isEventTimeListByDateWithNum(eventTimeList);
  const dateToGetList = dateKeys.map((dateKey) => {
    const dateToGet: PGetCalendarByDay = {
      year: isWithNum
        ? eventTimeList[dateKey][0].eventStartsAt.getFullYear()
        : eventTimeList[dateKey][0].getFullYear(),
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
      dispatch(setCalendarLoaded(true));
    });

  return { setCalendarStore };
};

export { getSchedules };
