import React from 'react';

interface Props {
  onClick: () => void; // 미팅 요약뷰 팝업
  startTime: object;
  title: string;
  voterList?: object;
}

function MeetingCard({ onClick, startTime, title, voterList }: Props) {
  return (
    <button className="black-button" onClick={onClick}>
      <img src={startIcon} alt="1" />
      {title}
    </button>
  );
}

export default MeetingCard;
