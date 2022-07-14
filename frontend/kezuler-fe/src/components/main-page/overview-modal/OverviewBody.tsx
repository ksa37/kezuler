import React, { useMemo } from 'react';

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
    eventTitle,
    eventDescription,
    eventAttachment,
    eventZoomAddress,
    eventPlace,
    eventHost: { userName: hostName, userProfileImage: hostProfileImage },
  } = event;

  const { copyText } = useCopyText();

  const handleCopyPlaceClick = () => {
    if (eventZoomAddress) {
      copyText(eventZoomAddress, '주소가');
    } else {
      copyText(eventPlace, '장소가');
    }
  };

  const handleAttachmentClick = () => {
    copyText(eventAttachment, '참고 자료가');
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
      <header className={'overview-header'}>
        <div className={'overview-header-title'}>미팅 제목</div>
        <div className={'overview-header-desc'}>{eventTitle}</div>
        {isFixedEvent(event) && !isCanceled && !isPassed && (
          <OverviewDropdown />
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
              {eventDescription}
            </div>
          </OverviewSection>
        )}
        {eventAttachment && (
          <OverviewSection title={'참고 자료'}>
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