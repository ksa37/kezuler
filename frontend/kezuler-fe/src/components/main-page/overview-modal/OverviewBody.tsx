import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import classNames from 'classnames';

import useCopyText from 'src/hooks/useCopyText';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewDropdown from './OverviewDropdown';
import OverviewParticipants from './OverviewParticipants';
import OverviewSection from './OverviewSection';

import { ReactComponent as CopyIcon } from 'src/assets/icn_copy.svg';
import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';

interface Props {
  eventDate: string;
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
    eventZoomAddress,
    eventPlace,
    eventHost: { userName: hostName, userProfileImage: hostProfileImage },
  } = event;

  const { copyText } = useCopyText();

  const [showDescAll, setShowDescAll] = useState(false);

  const shortEventDescription = eventDescription
    .split('\n')[0]
    .substring(0, 16);

  const handleCopyPlaceClick = () => {
    if (eventZoomAddress) {
      copyText(eventZoomAddress, '주소가');
    } else {
      copyText(eventPlace, '장소가');
    }
  };

  const handleShowAllClick = () => {
    setShowDescAll(!showDescAll);
  };

  const handleAttachmentClick = () => {
    copyText(eventAttachment, '참조 링크가');
  };

  const place = useMemo(
    () => (
      <div className={'overview-section-place'}>
        {eventPlace ? (
          <>
            <LocIcon />
            <span>{eventPlace}</span>
          </>
        ) : (
          <>
            <PCIcon />
            <span>{eventZoomAddress ? eventZoomAddress : '온라인'}</span>
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
    [eventZoomAddress, eventPlace]
  );

  return (
    <>
      <header
        className={classNames(
          'overview-header',
          { 'is-canceled': isCanceled },
          { 'is-passed': isPassed }
        )}
      >
        <div className={'overview-header-title'}>미팅 제목</div>
        <div className={'overview-header-desc'}>{eventTitle}</div>
        {isFixedEvent(event) && !isCanceled && !isPassed && (
          <OverviewDropdown eventId={eventId} />
        )}
      </header>
      <div className={'overview-body'}>
        {!isFixedEvent(event) && (
          <OverviewSection
            title={'주최자'}
            profileImageUrl={hostProfileImage}
            profileImageAlt={hostName}
          >
            <div>{hostName}</div>
          </OverviewSection>
        )}
        {eventDate && (
          <OverviewSection title={'일시'}>{eventDate}</OverviewSection>
        )}
        <OverviewSection title={'장소'}>{place}</OverviewSection>
        {eventDescription && (
          <OverviewSection title={'미팅 내용'}>
            <div className={'overview-section-description'}>
              {showDescAll ? eventDescription : shortEventDescription}
              {shortEventDescription !== eventDescription && (
                <Button
                  classes={{ root: 'show-all-btn' }}
                  onClick={handleShowAllClick}
                >
                  {showDescAll ? '...접기' : '...더보기'}
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
        {isFixedEvent(event) && !isCanceled && (
          <OverviewParticipants event={event} />
        )}
      </div>
    </>
  );
}

export default OverviewBody;
