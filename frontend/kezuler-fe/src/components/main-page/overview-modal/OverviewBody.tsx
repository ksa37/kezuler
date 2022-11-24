import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button } from '@mui/material';
import classNames from 'classnames';
import { format } from 'date-fns/esm';

import PathName from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import { historyStorageActions } from 'src/reducers/HistoryStorage';
import { AppDispatch } from 'src/store';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { getTimeRange } from 'src/utils/dateParser';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import getTimezoneDate from 'src/utils/getTimezoneDate';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewDropdown from './OverviewDropdown';
import OverviewHost from './OverviewHost';
import OverviewParticipants from './OverviewParticipants';
import OverviewSection from './OverviewSection';

import { ReactComponent as CopyIcon } from 'src/assets/icn_copy.svg';
import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';

interface Props {
  eventDate?: number;
  event: BFixedEvent | BPendingEvent;
  isCanceled?: boolean;
  isPassed?: boolean;
}

function OverviewBody({ eventDate, event, isCanceled, isPassed }: Props) {
  const {
    eventId,
    eventTitle,
    eventDescription,
    eventAttachment,
    eventTimeDuration,
    addressType,
    addressDetail,
    eventHost: {
      userName: hostName,
      userProfileImage: hostProfileImage,
      userId: hostId,
    },
  } = event;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { setPrevUrl, setEventTitle } = historyStorageActions;
  const { copyText } = useCopyText();

  const [showDescAll, setShowDescAll] = useState(false);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const [foldEllipsis, setFoldEllipsis] = useState(false);

  let canceledFixedGuest = false;
  if (isFixedEvent(event) && hostId !== getCurrentUserInfo()?.userId) {
    canceledFixedGuest =
      event.participants.filter(
        (guest) => guest.userId === getCurrentUserInfo()?.userId
      )[0].userStatus === 'Declined';
  }

  const shortEventDescription = eventDescription
    .split('\n')[0]
    .substring(0, 16);

  const handleCopyPlaceClick = () => {
    if (addressType === 'ON') {
      copyText(addressDetail, '주소가');
    } else {
      copyText(addressDetail, '장소가');
    }
  };

  const handleShowAllClick = () => {
    setShowDescAll(!showDescAll);
  };

  const handleAttachmentClick = () => {
    copyText(eventAttachment, '참조 링크가');
  };

  const handleStorageClick = () => {
    dispatch(setEventTitle(eventTitle));
    dispatch(setPrevUrl(location.pathname));
    navigate(`${PathName.storage}/${eventId}`);
  };

  const addressDetailElem = null;

  useEffect(() => {
    const addressDetailElem = document.getElementById('addressDetail');

    const checkEllipsisActive = (e: any) => {
      if (!e) return false;
      e.style.overflow = 'initial';
      const noEllipsisWidth = e.offsetWidth;
      e.style.overflow = 'hidden';
      const ellipsisWidth = e.offsetWidth;
      return ellipsisWidth < noEllipsisWidth;
    };

    setIsEllipsisActive(checkEllipsisActive(addressDetailElem));
  }, [addressDetailElem, isEllipsisActive]);

  const place = useMemo(
    () => (
      <div
        className={classNames('overview-section-place', {
          'is-ellipsis': isEllipsisActive,
          'is-fold': foldEllipsis,
        })}
      >
        {addressType === 'OFF' ? (
          <>
            <LocIcon />
            {isEllipsisActive ? (
              !foldEllipsis ? (
                <KeyboardArrowDownIcon
                  onClick={() => setFoldEllipsis((prev) => !prev)}
                  className={classNames('overview-section-place', {
                    'is-ellipsis': isEllipsisActive,
                  })}
                />
              ) : (
                <KeyboardArrowUpIcon
                  onClick={() => setFoldEllipsis((prev) => !prev)}
                  className={classNames('overview-section-place', {
                    'is-ellipsis': isEllipsisActive,
                  })}
                />
              )
            ) : null}
            <span
              className={classNames('overview-section-fold', {
                'is-fold': foldEllipsis,
              })}
              id="addressDetail"
            >
              {addressDetail}
            </span>
          </>
        ) : (
          <>
            <PCIcon />
            {addressDetail ? (
              <>
                {isEllipsisActive ? (
                  !foldEllipsis ? (
                    <KeyboardArrowDownIcon
                      onClick={() => setFoldEllipsis((prev) => !prev)}
                      className={classNames('overview-section-place', {
                        'is-ellipsis': isEllipsisActive,
                      })}
                    />
                  ) : (
                    <KeyboardArrowUpIcon
                      onClick={() => setFoldEllipsis((prev) => !prev)}
                      className={classNames('overview-section-place', {
                        'is-ellipsis': isEllipsisActive,
                      })}
                    />
                  )
                ) : null}
                <a
                  id="addressDetail"
                  href={addressDetail}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    className={classNames('overview-section-fold', {
                      'is-fold': foldEllipsis,
                    })}
                  >
                    {addressDetail}
                  </span>
                </a>
              </>
            ) : (
              <span>{'온라인'}</span>
            )}
          </>
        )}
        <button
          className={'overview-section-copy-btn'}
          onClick={handleCopyPlaceClick}
        >
          <CopyIcon />
          복사
        </button>
      </div>
    ),
    [addressType, addressDetail, isEllipsisActive, foldEllipsis]
  );

  return (
    <>
      <header
        className={classNames(
          'overview-header',
          { 'is-canceled': isCanceled || canceledFixedGuest },
          { 'is-passed': isPassed }
        )}
      >
        <div className={'overview-header-title'}>미팅 제목</div>
        <div className={'overview-header-desc'}>{eventTitle}</div>
      </header>
      <div className={'overview-body'}>
        {!isFixedEvent(event) && (
          <OverviewHost
            hostName={hostName}
            profileImageUrl={hostProfileImage}
            profileImageAlt={hostName}
          />
        )}
        {eventDate && (
          <OverviewSection title={'일시'}>
            {/* {eventDate} */}
            {format(getTimezoneDate(eventDate), 'yyyy년 M월 d일 ') +
              getTimeRange(getTimezoneDate(eventDate), eventTimeDuration)}
          </OverviewSection>
        )}
        <OverviewSection title={'장소'}>{place}</OverviewSection>
        {eventDescription && (
          <OverviewSection title={'미팅 내용'}>
            <div className={'overview-section-description'}>
              {eventDescription.replaceAll('\\n', '\n')}
              {/* {showDescAll
                ? eventDescription.replaceAll('\\n', '\n')
                : shortEventDescription.replaceAll('\\n', '\n')} */}
              {shortEventDescription !== eventDescription && (
                <Button
                  classes={{ root: 'show-all-btn' }}
                  onClick={handleShowAllClick}
                >
                  {/* {showDescAll ? '...접기' : '...더보기'} */}
                </Button>
              )}
            </div>
          </OverviewSection>
        )}
        {eventAttachment && (
          <OverviewSection title={'참조 링크'}>
            <div className={'overview-section-attachment'}>
              <a
                href={eventAttachment}
                target="_blank"
                rel="noreferrer"
                className={'overview-section-attachment-link'}
              >
                {eventAttachment}
              </a>
              <button
                className={'overview-section-copy-btn'}
                onClick={handleAttachmentClick}
              >
                <CopyIcon />
                복사
              </button>
            </div>
          </OverviewSection>
        )}
        <OverviewSection title={'참고자료'} alignWith>
          <button
            className={'overview-section-storage-btn'}
            onClick={handleStorageClick}
          >
            보관함 바로가기
          </button>
        </OverviewSection>
        {isFixedEvent(event) &&
          !isCanceled &&
          !isPassed &&
          !canceledFixedGuest &&
          eventDate && (
            <OverviewSection title="리마인더" alignWith>
              <OverviewDropdown eventId={eventId} eventStartsAt={eventDate} />
            </OverviewSection>
          )}
        {/* {isFixedEvent(event) && !isCanceled && ( */}
        {!isCanceled && <OverviewParticipants event={event} />}
      </div>
    </>
  );
}

export default OverviewBody;
