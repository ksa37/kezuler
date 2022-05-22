import React from 'react';
import { Avatar, AvatarGroup, Card } from '@mui/material';

import { FixedEvent } from 'src/types/fixedEvent';

interface Props {
  onClick: () => void; // 미팅 요약뷰 팝업
  fixedEvent: FixedEvent;
}

function MeetingCard({ onClick, fixedEvent }: Props) {
  const { eventTitle, eventTimeStartsAt, participants } = fixedEvent;
  const maxAvatarNum = 3;

  return (
    <Card className="meeting-card" onClick={onClick}>
      {eventTimeStartsAt}
      {eventTitle}
      <AvatarGroup max={maxAvatarNum} total={participants.length}>
        {participants.map((p) => {
          return (
            <Avatar key={p.userId} alt={p.userId} src={p.userProfileImage} />
          );
        })}
      </AvatarGroup>
    </Card>
  );
}

export default MeetingCard;
