import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface Props {
  eventId: string;
  eventTitle: string;
  eventTimeDuration: number;
  eventTimeStartsAt: number;
}

const getIcsLink = ({
  eventId,
  eventTitle,
  eventTimeStartsAt,
  eventTimeDuration,
}: Props) => {
  const startDate = utcToZonedTime(eventTimeStartsAt, 'UTC');
  const endDate = utcToZonedTime(
    eventTimeStartsAt + eventTimeDuration * 60000,
    'UTC'
  );

  const url = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'X-WR-CALNAME:My Calendar Name',
    'BEGIN:VEVENT',
    `DTSTART:${format(startDate, 'yyyyMMdd')}T${format(startDate, 'HHmm')}00Z`,
    `DTEND:${format(endDate, 'yyyyMMdd')}T${format(endDate, 'HHmm')}00Z`,
    'SUMMARY:' + eventTitle,
    'DESCRIPTION:' +
      `미팅 정보 확인하기: https://kezuler.com/main/fixed/${eventId}/info \n 미팅 취소하기: https://kezuler.com/main/fixed/${eventId}/info`,
    'LOCATION:',
    'BEGIN:VALARM',
    // 'TRIGGER:-PT15M',
    'REPEAT:1',
    // 'DURATION:PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');

  const blob = new Blob([url], { type: 'text/calendar;charset=utf-8' });

  if (/msie\s|trident\/|edge\//i.test(window.navigator.userAgent)) {
    // Open/Save link in IE and Edge
    console.log('hello');
    (window.navigator as any).msSaveBlob(blob, `${eventTitle}.ics`);
  } else {
    // Open/Save link in Modern Browsers
    const link = document.createElement('a');
    link.href = encodeURI('data:text/calendar;charset=utf8,' + url);
    link.download = `${eventTitle}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // window.open();
  }
};

export { getIcsLink };
