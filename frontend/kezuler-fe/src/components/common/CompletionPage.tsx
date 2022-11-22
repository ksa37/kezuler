import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import useGoogleConnect from '../../hooks/useGoogleConnect';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import BottomButton from 'src/components/common/BottomButton';
import BottomPopper from 'src/components/common/BottomPopper';

import CelebrateIcon from 'src/assets/image/celebrate.png';
import CelebrateSmileIcon from 'src/assets/image/celebrate-emoji.png';
import BottomCalendarBg from 'src/assets/img_bottom_popper_calendar.svg';

interface Props {
  boldTextFirst: string;
  boldTextSecond: string;
  regularTextFirst: string;
  regularTextSecond: string;
}

function CompletionPage({
  boldTextFirst,
  boldTextSecond,
  regularTextFirst,
  regularTextSecond,
}: Props) {
  const navigate = useNavigate();
  const { googleToggle } = useMemo(() => ({ ...getCurrentUserInfo() }), []);

  const [isCalendarPaired, setIsCalendarPaired] = useState(googleToggle);

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
    navigate(PathName.mainFixed);
  };

  const [popupOpened, setPopupOpened] = useState(true);

  const handleClosePopper = () => {
    setPopupOpened(false);
  };

  return (
    <div className={'acceptance-completion'}>
      <div className={'accept-description-text'}>
        {boldTextFirst}
        <br />
        {boldTextSecond}
      </div>
      <div className={'acceptance-completion-sub-description'}>
        {regularTextFirst}
        <br />
        {regularTextSecond}
      </div>
      <div className={'acceptance-completion-bottom-area'}>
        {!isCalendarPaired && (
          <BottomPopper
            title={'케줄러 100% 활용하기'}
            description={'캘린더를 연동하여 이중약속을 방지해요!'}
            buttonText={'구글 계정 연동하기'}
            onClick={handleConnectClick}
            onDisableClick={handleClosePopper}
            image={BottomCalendarBg}
            notFixed
          />
        )}
        <BottomButton onClick={handleHomeClick} text={'홈으로 가기'} notFixed />
      </div>
      {(!popupOpened || isCalendarPaired) && (
        <>
          <img
            src={CelebrateSmileIcon}
            className={'celebrate-smile-icon-confirm'}
            alt={''}
          />
          <img
            src={CelebrateIcon}
            className={'celebrate-icon-confirm'}
            alt={''}
          />
        </>
      )}
    </div>
  );
}

export default CompletionPage;
