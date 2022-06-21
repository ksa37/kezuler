import React, { useMemo } from 'react';

import useCopyText from 'src/hooks/useCopyText';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewDropdown from 'src/components/modal/overview-modal/OverviewDropdown';
import OverviewParticipants from 'src/components/modal/overview-modal/OverviewParticipants';
import OverviewSection from 'src/components/modal/overview-modal/OverviewSection';

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
    () =>
      eventPlace !== '' ? (
        <div className={'overview-section-place'}>
          <LocIcon />
          {eventPlace}
        </div>
      ) : (
        <div className={'overview-section-place'}>
          <PCIcon />
          {eventZoomAddress ? eventZoomAddress : '온라인'}
        </div>
      ),
    [eventZoomAddress, eventPlace]
  );

  return (
    <>
      <header className={'overview-header'}>
        <div className={'overview-header-title'}>미팅 제목</div>
        <h1 className={'overview-header-desc'}>{eventTitle}</h1>
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
            {hostName}
          </OverviewSection>
        )}
        {eventDate && (
          <OverviewSection title={'일시'}>{eventDate}</OverviewSection>
        )}
        <OverviewSection title={'장소'}>
          {place}
          <button
            className={'overview-section-copy-btn'}
            onClick={handleCopyPlaceClick}
          >
            <CopyIcon />
            복사하기
          </button>
        </OverviewSection>
        {eventDescription && (
          <OverviewSection title={'미팅 내용'}>
            {eventDescription}
          </OverviewSection>
        )}
        {eventAttachment && (
          <OverviewSection title={'참고 자료'}>
            <a
              href={eventAttachment}
              target="_blank"
              rel="noreferrer"
              className={'overview-section-attachment'}
            >
              {eventAttachment}
            </a>
            <button
              className={'overview-section-copy-btn'}
              onClick={handleAttachmentClick}
            >
              <CopyIcon />
              복사하기
            </button>
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
