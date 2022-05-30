import React, { useMemo } from 'react';

import { dateToMMdd, getKorDay } from 'src/utils/dateParser';

function EmptyFixedEventCard() {
  const now = new Date();
  const MMdd = useMemo(() => dateToMMdd(now), [now]);
  const day = useMemo(() => getKorDay(now), [now]);

  return (
    <section className={'fixed-event-card'}>
      <div className={'fixed-event-card-date'}>
        <span>{MMdd}</span>
        {day}
      </div>
      <div className={'fixed-event-card-empty-info'}>
        예정된 미팅이 없습니다.
      </div>
      <div className={'fixed-event-card-empty-day'}>Today</div>
    </section>
  );
}

export default EmptyFixedEventCard;
