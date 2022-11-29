import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';
import useGoogleConnect from 'src/hooks/useGoogleConnect';
import { RootState } from 'src/reducers';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import { getIcsLink } from 'src/utils/getIcsLink';

import BottomButton from 'src/components/common/BottomButton';
import BottomCard from 'src/components/common/BottomCard';

function AcceptFixedCompletion() {
  const navigate = useNavigate();
  const { googleToggle } = useMemo(() => ({ ...getCurrentUserInfo() }), []);
  const [isCalendarPaired, setIsCalendarPaired] = useState(googleToggle);
  const { fixedEvent } = useSelector((state: RootState) => state.acceptMeeting);
  const {
    eventId,
    eventTitle,
    // eventDescription,
    // eventAttachment,
    // addressType,
    // addressDetail,
    eventTimeDuration,
    eventTimeStartsAt,
  } = fixedEvent;
  const { handleGooglelogin } = useGoogleConnect({
    onSuccess: () => {
      setIsCalendarPaired(!isCalendarPaired);
    },
  });
  const handleConnectClick = () => {
    if (!googleToggle) {
      handleGooglelogin();
    }
  };

  const handleHomeClick = () => {
    navigate(PathName.mainPending, {
      replace: true,
    });
  };

  const handleIcsClick = () => {
    getIcsLink({ eventId, eventTitle, eventTimeStartsAt, eventTimeDuration });
  };

  return (
    <div className={'acceptance-completion'}>
      <div className={'accept-description-text'}>
        {'미팅 참여를'}
        <br />
        {'환영합니다!'}
      </div>
      <div
        className={classNames('acceptance-completion-sub-description', 'fixed')}
      >
        {'미팅 정보에서'}
        <br />
        {'리마인더 기능도 설정해보세요!'}
      </div>

      <BottomCard
        descriptions={[
          {
            text: '참여하는 일정을 잊지 않도록',
            highlight: false,
            break: true,
          },
          {
            text: ' 내 캘린더에 추가',
            highlight: true,
          },
          {
            text: '할 수 있어요!',
            highlight: false,
          },
        ]}
        buttons={[
          { title: '캘린더 연동하기', onClick: handleConnectClick },
          { title: '이 일정만 추가하기', onClick: handleIcsClick },
        ]}
      />
      <BottomButton onClick={handleHomeClick} text={'홈으로 가기'} />
    </div>
  );
}

export default AcceptFixedCompletion;
