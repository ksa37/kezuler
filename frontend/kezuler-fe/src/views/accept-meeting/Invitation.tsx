import React, { useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Avatar } from '@mui/material';
import classNames from 'classnames';

import { KAKAO_AUTH_URL, LOGIN_REDIRECT_KEY } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import useIsLoggedIn from 'src/hooks/useIsLoggedIn';
import { RootState } from 'src/reducers';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import { isModification } from 'src/utils/joinMeeting';

import BottomPopper from 'src/components/common/BottomPopper';

import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';
import KakaoIcon from 'src/assets/img_kakao.svg';
import popupBgInvite from 'src/assets/popup_bg_invitation.svg';

function Invitation() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { show } = alertAction;
  const {
    eventId,
    eventHost,
    eventTitle,
    eventDescription,
    eventAttachment,
    addressType,
    addressDetail,
    eventTimeCandidates,
    declinedUsers,
  } = pendingEvent;

  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();

  const isHost = useMemo(
    () => eventHost.userId === getCurrentUserInfo()?.userId,
    [eventHost.userId]
  );

  const [scrollHeight, setScrollHeight] = useState(0);
  const [finalHeight, setFinalHeight] = useState(0);
  const [isEllipsis, setIsEllipsis] = useState(false);
  const [isEllipsisLink, setIsEllipsisLink] = useState(false);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const [isShowMoreNeed, setIsShowMoreNeed] = useState(false);
  const [isShowMoreNeedLink, setIsShowMoreNeedLink] = useState(false);
  const [foldEllipsis, setFoldEllipsis] = useState(false);

  useEffect(() => {
    if (eventDescription.split('\\n')[1]) {
      setIsEllipsis(true);
      setIsShowMoreNeed(true);
    } else if (eventAttachment) {
      setIsEllipsis(true);
    } else setIsEllipsis(false);

    if (
      Number(
        document.getElementById('event-description-text-ellipsis')?.clientHeight
      ) > 0
    )
      setScrollHeight(
        Number(
          document.getElementById('event-description-text-ellipsis')
            ?.clientHeight
        ) + 100
      );

    if (isNaN(scrollHeight) && isNaN(window.innerHeight)) {
      setFinalHeight(window.innerHeight);
    } else {
      setFinalHeight(scrollHeight + window.innerHeight);
    }
  }, [scrollHeight]);

  const addressDetailElem = null;
  const linkDetailElem = null;

  useEffect(() => {
    const addressDetailElem = document.getElementById('addressDetail');
    const linkDetailElem = document.getElementById('linkDetail');
    if (eventDescription && eventAttachment) {
      setIsEllipsis(true);
      setIsShowMoreNeed(true);
    }
    const checkEllipsisActive = (e: any) => {
      if (!e) return false;
      e.style.overflow = 'initial';
      const noEllipsisWidth = e.offsetWidth;
      e.style.overflow = 'hidden';
      const ellipsisWidth = e.offsetWidth;
      return ellipsisWidth < noEllipsisWidth;
    };
    const linkDoubleLineOver = (e: any) => {
      if (!e) return false;
      return e.offsetHeight > 19;
    };

    setIsEllipsisActive(checkEllipsisActive(addressDetailElem));
    setIsEllipsisLink(linkDoubleLineOver(linkDetailElem));
    setIsShowMoreNeedLink(linkDoubleLineOver(linkDetailElem));
  }, [addressDetailElem, linkDetailElem, isEllipsisActive, isShowMoreNeedLink]);

  const handleNextClick = () => {
    if (isHost) {
      dispatch(
        show({
          title: '참여오류',
          description: '해당 미팅의 호스트입니다.',
        })
      );
      navigate(`${PathName.mainPending}`);
    } else if (isModification(eventTimeCandidates, declinedUsers)) {
      navigate(`/modify/${eventId}`);
    } else {
      navigate(`${PathName.invite}/${eventId}/select`);
    }
  };

  const handleConnectClick = () => {
    location.href = KAKAO_AUTH_URL;
    sessionStorage.setItem(
      LOGIN_REDIRECT_KEY,
      `${PathName.invite}/${eventId}/select`
    );
  };

  const meetingTitleDescription = '미팅 제목';
  const meetingPlaceDescription = '미팅 장소';
  const meetingDescription = '미팅 내용';
  const meetingRefLink = '참조 링크';

  const timeSelectDescription = '참여 가능한 시간을 알려주세요';
  const loginButtonText = '시간 선택하기';
  const unloginButtonText = '카카오로 계속하기';

  return (
    <div
      id="invitationEL"
      className={classNames('invitation', {
        'is-mobile': isMobile,
      })}
      style={{ height: finalHeight }}
    >
      <div className={'invitation-info'}>
        <div className={'invitation-message'}>
          <b>{eventHost.userName}</b>
          {'님이 '}
          <br />
          {'미팅에 초대합니다.'}
        </div>
        <div
          className={classNames('invitation-card', {
            'is-showmore-need': isShowMoreNeed,
            'is-showmore-need-link': isShowMoreNeedLink,
          })}
        >
          <Avatar
            className={'invitation-avatar'}
            alt=""
            src={eventHost.userProfileImage}
          />
          <div className={'invitation-title-place'}>
            {meetingTitleDescription}
          </div>
          <div className={'invitation-title-text'}>{eventTitle}</div>
          <div className={classNames('invitation-title-place', 'place')}>
            {meetingPlaceDescription}
          </div>
          <div className={'invitation-place'}>
            {addressType === 'OFF' ? (
              <>
                <div className={classNames('invitation-place-icon')}>
                  <LocIcon />
                </div>
                {isEllipsisActive ? (
                  !foldEllipsis ? (
                    <KeyboardArrowDownIcon
                      onClick={() => setFoldEllipsis((prev) => !prev)}
                      className={classNames('invitation-place-arrow', {
                        'is-ellipsis': isEllipsisActive,
                      })}
                    />
                  ) : (
                    <KeyboardArrowUpIcon
                      onClick={() => setFoldEllipsis((prev) => !prev)}
                      className={classNames('invitation-place-arrow', {
                        'is-ellipsis': isEllipsisActive,
                      })}
                    />
                  )
                ) : null}
              </>
            ) : (
              <>
                <div className={classNames('invitation-place-icon')}>
                  <PCIcon />
                </div>
                {isEllipsisActive ? (
                  !foldEllipsis ? (
                    <KeyboardArrowDownIcon
                      onClick={() => setFoldEllipsis((prev) => !prev)}
                      className={classNames('invitation-place-arrow', {
                        'is-ellipsis': isEllipsisActive,
                      })}
                    />
                  ) : (
                    <KeyboardArrowUpIcon
                      onClick={() => setFoldEllipsis((prev) => !prev)}
                      className={classNames('invitation-place-arrow', {
                        'is-ellipsis': isEllipsisActive,
                      })}
                    />
                  )
                ) : null}
              </>
            )}
            <div
              id="addressDetail"
              className={classNames('invitation-place-text', {
                'is-ellipsis': isEllipsisActive,
                'is-fold': foldEllipsis,
              })}
            >
              {addressType === 'OFF' ? (
                addressDetail
              ) : (
                <>
                  {addressDetail ? (
                    <>
                      <a href={addressDetail} target="_blank" rel="noreferrer">
                        <span>{addressDetail}</span>
                      </a>
                      <div />
                    </>
                  ) : (
                    <span>{'온라인'}</span>
                  )}
                </>
              )}
            </div>
          </div>
          {eventDescription ? (
            <>
              <div className={classNames('invitation-section-wrapper')}>
                <div className={classNames('invitation-title-place', 'place')}>
                  {meetingDescription}
                </div>
              </div>
              {isEllipsis ? (
                <>
                  <div
                    className={classNames(
                      'invitation-description-text-ellipsis',
                      { 'is-showmore-need': isShowMoreNeed }
                    )}
                  >
                    {eventDescription.replaceAll('\\n', '\n')}
                  </div>
                </>
              ) : (
                <div
                  id="event-description-text-ellipsis"
                  className={'invitation-description-text'}
                >
                  {eventDescription.replaceAll('\\n', '\n')}
                </div>
              )}
              {isShowMoreNeed ? (
                <div
                  className={classNames('invitation-showmore')}
                  onClick={() => setIsEllipsis((prev) => !prev)}
                >
                  <span className={classNames('invitation-showmore-text')}>
                    {isEllipsis ? '펼쳐보기' : '접기'}
                  </span>
                  {isEllipsis ? (
                    <KeyboardArrowDownIcon
                      className={classNames('invitation-showmore-icon')}
                    />
                  ) : (
                    <KeyboardArrowUpIcon
                      className={classNames('invitation-showmore-icon')}
                    />
                  )}
                </div>
              ) : null}
            </>
          ) : null}
          {eventAttachment && !isEllipsis ? (
            <>
              <div className={classNames('invitation-section-wrapper')}>
                <div className={classNames('invitation-title-place', 'place')}>
                  {meetingRefLink}
                </div>
              </div>
              <a
                href={eventAttachment}
                target="_blank"
                rel="noreferrer"
                style={{ wordBreak: 'break-all' }}
              >
                <span style={{ wordBreak: 'break-all' }}>
                  {eventAttachment}
                </span>
              </a>
            </>
          ) : null}
          {/* 예외처리 미팅 내용은 없고 참조링크만 있는경우 */}
          {!eventDescription && eventAttachment ? (
            <>
              <div className={classNames('invitation-section-wrapper')}>
                <div className={classNames('invitation-title-place', 'place')}>
                  {meetingRefLink}
                </div>
              </div>
              <a href={eventAttachment} target="_blank" rel="noreferrer">
                <div
                  id="linkDetail"
                  className={classNames('invitation-link-text', {
                    'is-ellipsis-link': isEllipsisLink,
                  })}
                >
                  {eventAttachment}
                </div>
              </a>
              {isShowMoreNeedLink ? (
                <div
                  className={classNames('invitation-showmore')}
                  onClick={() => setIsEllipsisLink((prev) => !prev)}
                >
                  <span className={classNames('invitation-showmore-text')}>
                    {isEllipsisLink ? '펼쳐보기' : '접기'}
                  </span>
                  {isEllipsisLink ? (
                    <KeyboardArrowDownIcon
                      className={classNames('invitation-showmore-icon')}
                    />
                  ) : (
                    <KeyboardArrowUpIcon
                      className={classNames('invitation-showmore-icon')}
                    />
                  )}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
      <div>
        <BottomPopper
          title={timeSelectDescription}
          buttonText={isLoggedIn ? loginButtonText : unloginButtonText}
          onClick={isLoggedIn ? handleNextClick : handleConnectClick}
          image={popupBgInvite}
          isSmallTitle
          disableDelete
          btnStartIcon={
            !isLoggedIn ? (
              <img src={KakaoIcon} alt="1" className={'login-kakao-icn'} />
            ) : (
              <></>
            )
          }
        />
      </div>
    </div>
  );
}

export default Invitation;
