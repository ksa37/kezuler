import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { RootState } from 'src/reducers';

import BottomButton from 'src/components/common/BottomButton';
import ShareIcons from 'src/components/common/ShareIcons';

import CelebrateIcon from 'src/assets/image/celebrate.png';
import CelebrateSmileIcon from 'src/assets/image/celebrate-emoji.png';

function MeetingShare() {
  const { eventTitle, eventId } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(PathName.mainPending);
  };

  return (
    <div className={'create-wrapper'}>
      <div className={'padding-wrapper'}>
        <div className={'description-text'}>
          {'새로운 미팅 일정이'}
          <br />
          {'완성되었습니다!'}
        </div>
        <div className={'sub-description-text'}>
          {'케줄러링크를 통해'}
          <br />
          {'사람들을 미팅에 초대하세요!'}
        </div>
        <ShareIcons eventTitle={eventTitle} eventId={eventId} />
        <img
          src={CelebrateSmileIcon}
          className={'celebrate-smile-icon'}
          alt={''}
        />
        <img src={CelebrateIcon} className={'celebrate-icon'} alt={''} />
      </div>
      <BottomButton onClick={handleHomeClick} text="홈으로 가기" />
    </div>
  );
}

export default MeetingShare;
