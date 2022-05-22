import React from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';

interface Props {
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  // highlightDates: Date[];
}

function CalendarView({ startDate, setStartDate }: Props) {
  return (
    <DatePicker
      locale={ko}
      selected={startDate}
      onChange={setStartDate}
      // highlightDates={highlightDates}
      inline
    />
  );
}

export default CalendarView;
