import React from 'react';
import DatePicker from 'react-datepicker';
import { addMonths } from 'date-fns';
import { ko } from 'date-fns/esm/locale';

import 'src/styles/components.scss';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  highlightDates: Date[];
}

function CalendarView({ startDate, setStartDate, highlightDates }: Props) {
  return (
    <DatePicker
      locale={ko}
      selected={startDate}
      onChange={setStartDate}
      highlightDates={highlightDates}
      minDate={new Date()}
      maxDate={addMonths(new Date(), 6)}
      showDisabledMonthNavigation
      // todayButton="오늘"
      // showTimeSelect
      // timeFormat="HH:mm"
      // timeIntervals={15}
      // timeCaption="time"
      inline
    />
  );
}

export default CalendarView;
