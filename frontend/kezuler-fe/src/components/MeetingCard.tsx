import React from 'react';
import { Avatar, AvatarGroup, Card } from '@mui/material';

import FixedEvent from '../types/fixedEvent';

interface Props {
  onClick: () => void; // 미팅 요약뷰 팝업
  fixedEvent: FixedEvent;
}

function MeetingCard({ onClick, fixedEvent }: Props) {
  const eventTitle = fixedEvent.eventTitle;
  const eventTimeStartsAt = fixedEvent.eventTimeStartsAt;
  const participantImages = fixedEvent.participantImage;
  const maxAvatarNum = 3;
  return (
    <Card className="meeting-card" onClick={onClick}>
      {eventTimeStartsAt}
      {eventTitle}
      <AvatarGroup max={maxAvatarNum} total={participantImages.length}>
        {participantImages.map((image) => {
          return <Avatar key={image} alt={image} src={image} />;
        })}
      </AvatarGroup>
    </Card>
  );
}

export default MeetingCard;
