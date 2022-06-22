import React from 'react';

interface Props {
  onClick: () => void;
}

function CalendarPairBtn({ onClick }: Props) {
  return (
    <div className={'calendar-pair-ask'}>
      <div className={'calendar-pair-ask-txt'}>
        {'캘린더를 연동하여'}
        <br />
        {'이중약속을 방지해요!'}
      </div>
      <div className={'calendar-pair-ask-btn'} onClick={onClick}>
        <div className={'btn-txt'}>나의 일정 </div>
        <div className={'btn-txt'}>불러오기</div>
      </div>
    </div>
  );
}

export default CalendarPairBtn;
