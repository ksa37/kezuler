import React, { useMemo } from 'react';

import { dateToMMdd } from 'src/utils/dateParser';

function EmptyFixedEventCard() {
  const now = new Date();
  const MMdd = useMemo(() => dateToMMdd(now), [now]);

  return (
    <section>
      <div>{MMdd}</div>
      <div>예정된 미팅이 없습니다.</div>
      <div>Today</div>
    </section>
  );
}

export default EmptyFixedEventCard;
