import React from 'react';

import { ReactComponent as CalenderIcon } from 'src/assets/icn_calender_yb.svg';
import { ReactComponent as CancelIcon } from 'src/assets/icn_cancel_yb.svg';
import { ReactComponent as ContentsIcon } from 'src/assets/icn_conents_yb.svg';
import { ReactComponent as InfoIcon } from 'src/assets/icn_info_yb.svg';

function NotiCard() {
  const icon = <CalenderIcon />;
  const contents = (
    <span>
      <b>동아리 저녁 모임</b> 미팅장소가 호스트에 의해 카카오카페로
      변경되었습니다.
    </span>
  );
  const time = '5시간 전';

  return (
    <section className={'noti-card'}>
      <div className={'noti-card-main'}>
        {icon}
        {contents}
      </div>
      <div className={'noti-card-time'}>{time}</div>
    </section>
  );
}

export default NotiCard;
