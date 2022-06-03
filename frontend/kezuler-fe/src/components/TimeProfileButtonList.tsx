import React from 'react';

import { EventTimeCandidate } from 'src/types/pendingEvent';
import { parseDateString } from 'src/utils/dateParser';

import TimeProfileButton from './TimeProfileButton';

interface Props {
  onClick: () => void;
  eventTimeDuration: number;
  eventTimeCandidates: EventTimeCandidate[];
}

function TimeProfileButtonList({
  onClick,
  eventTimeDuration,
  eventTimeCandidates,
}: Props) {
  // const eventTimeDates = eventTimeCandidates.map(
  //   (eventTimeCandidate) => Object.keys(eventTimeCandidate)[0]
  // );

  // console.log(eventTimeDates);

  // interface EventMonthsObj {
  //   [month: string]: number;
  // }
  // const eventMonthsObj: EventMonthsObj = {};

  // const eventTimeMonths = Array.from(
  //   new Set(eventTimeDates.map((eventTimeDate) => eventTimeDate.split('-')[1]))
  // );

  // console.log(eventTimeMonths);

  // for (let i = 0; i < eventTimeDates.length; i++) {
  //   const monthFromDate = eventTimeDates[i].split('-')[1];
  //   eventMonthsObj[monthFromDate] = 1 + (eventMonthsObj[monthFromDate] || 0);
  // }

  // console.log(eventMonthsObj);

  // interface EventMonthsStartEndObj {
  //   [month: string]: StartEnd;
  // }
  // type StartEnd = { start: number; end: number };

  // const setStartEnd = (
  //   eventTimeMonths: string[],
  //   eventMonthsObj: EventMonthsObj
  // ) => {
  //   let count = 0;
  //   const eventMonthsStartEndObj: EventMonthsStartEndObj = {};
  //   for (let i = 0; i < eventTimeMonths.length; i++) {
  //     eventMonthsStartEndObj[eventTimeMonths[i]] = {
  //       start: count,
  //       end: count + eventMonthsObj[i],
  //     };
  //     count += eventMonthsObj[i];
  //   }
  //   return eventMonthsStartEndObj;
  // };

  // const eventMonthsStartEndObj = setStartEnd(eventTimeMonths, eventMonthsObj);
  // console.log(eventMonthsStartEndObj);

  //duration 계산하는거 넣어야함
  return (
    <>
      {eventTimeCandidates.map(({ eventStartsAt, possibleUsers }) => {
        return (
          <>
            <div>{parseDateString(eventStartsAt)}</div>
            <TimeProfileButton
              key={eventStartsAt}
              onClick={onClick}
              eventStartsAt={eventStartsAt}
              eventTimeDuration={eventTimeDuration}
              possibleUsersList={possibleUsers}
            />
          </>
        );
      })}
    </>
  );
}

export default TimeProfileButtonList;
