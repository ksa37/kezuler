import React, { useEffect, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';

import { OVERVIEW_FORM_ID, PLACE_OPTIONS } from 'src/constants/Main';
import useMainFixed from 'src/hooks/useMainFixed';
import useMainPending from 'src/hooks/useMainPending';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { isFixedEvent } from 'src/utils/typeGuard';

import KezulerDropdown from 'src/components/common/KezulerDropdown';
import OverviewDropdown from 'src/components/modal/overview-modal/OverviewDropdown';
import OverviewParticipants from 'src/components/modal/overview-modal/OverviewParticipants';
import OverviewSection from 'src/components/modal/overview-modal/OverviewSection';

import { ReactComponent as ArrowDownIcon } from 'src/assets/icn_dn_outline.svg';
import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';

import { patchFixedEventById } from 'src/api/fixedEvent';
import { patchPendingEventsById } from 'src/api/pendingEvent';

interface Props {
  setIsEdit: (newVal: boolean) => void;
  eventDate: string;
  event: BFixedEvent | BPendingEvent;
  isCanceled?: boolean;
  isPassed?: boolean;
}

interface EventForm {
  eventTitle: string;
  eventDescription: string;
  eventAttachment: string;
  eventZoomAddress: string;
  eventPlace: string;
}

const usePatchEvent = () => {
  const [loading, setLoading] = useState(false);
  // TODO
  const { getPendingEvents } = useMainPending();
  const { getFixedEvents } = useMainFixed();

  const patch = (
    isFixedEvent: boolean,
    eventId: string,
    params: EventForm,
    onFinally: () => void
  ) => {
    setLoading(true);
    (isFixedEvent ? patchFixedEventById : patchPendingEventsById)(
      eventId,
      params
    )
      .then(() => {
        (isFixedEvent ? getFixedEvents : getPendingEvents)(onFinally);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, patch };
};

function OverviewEdit({
  setIsEdit,
  eventDate,
  event,
  isCanceled,
  isPassed,
}: Props) {
  const {
    eventId,
    eventTitle,
    eventDescription,
    eventAttachment,
    eventZoomAddress,
    eventPlace,
    eventHost: { userName: hostName, userProfileImage: hostProfileImage },
  } = event;

  const { loading, patch } = usePatchEvent();

  const { register, handleSubmit, setValue } = useForm<EventForm>();

  const onValid: SubmitHandler<EventForm> = (data) => {
    console.log(data);
    patch(isFixedEvent(event), eventId, data, () => {
      setIsEdit(false);
    });
  };
  const onInvalid: SubmitErrorHandler<EventForm> = (error) => {
    console.log(error);
  };

  const [selectedPlaceIdx, setSelectedPlaceIdx] = useState(eventPlace ? 1 : 0);

  useEffect(() => {
    if (selectedPlaceIdx === 0) {
      setValue('eventPlace', '');
    } else {
      setValue('eventZoomAddress', '');
    }
  }, [selectedPlaceIdx]);

  const isSelectOnline = selectedPlaceIdx === 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <form id={OVERVIEW_FORM_ID} onSubmit={handleSubmit(onValid, onInvalid)}>
      <header className={'overview-header'}>
        <div className={'overview-header-title'}>미팅 제목</div>
        <h1 className={'overview-header-desc'}>
          <input
            className={'overview-title-input'}
            onKeyDown={handleKeyDown}
            defaultValue={eventTitle}
            {...register('eventTitle', {
              required: true,
            })}
            placeholder={'미팅 제목을 입력하세요.'}
          />
        </h1>
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
          <KezulerDropdown
            startIcon={isSelectOnline ? <PCIcon /> : <LocIcon />}
            endIcon={<ArrowDownIcon />}
            menuData={PLACE_OPTIONS}
            displayKey={'display'}
            selectedIdx={selectedPlaceIdx}
            setSelectedIdx={setSelectedPlaceIdx}
            buttonClassName={'overview-place-dropdown-btn'}
            menuClassName={'overview-place-menu'}
            fitToButtonWidth
          />
          {isSelectOnline ? (
            <input
              className={'overview-body-input'}
              onKeyDown={handleKeyDown}
              defaultValue={eventZoomAddress}
              {...register('eventZoomAddress')}
              placeholder={'링크를 입력하세요. (선택)'}
            />
          ) : (
            <input
              className={'overview-body-input'}
              onKeyDown={handleKeyDown}
              defaultValue={eventPlace}
              {...register('eventPlace')}
              placeholder={'장소정보나 주소를 입력하세요. (선택)'}
            />
          )}
        </OverviewSection>
        <OverviewSection title={'미팅 내용'}>
          <input
            className={'overview-body-input'}
            onKeyDown={handleKeyDown}
            defaultValue={eventDescription}
            {...register('eventDescription')}
            placeholder={'미팅 내용을 입력하세요. (선택)'}
          />
        </OverviewSection>
        <OverviewSection title={'참고 자료'}>
          <input
            className={'overview-body-input'}
            onKeyDown={handleKeyDown}
            defaultValue={eventAttachment}
            {...register('eventAttachment')}
            placeholder={'참고 자료를 입력하세요. (선택)'}
          />
        </OverviewSection>
        {isFixedEvent(event) && !isCanceled && (
          <OverviewParticipants event={event} />
        )}
      </div>
    </form>
  );
}

export default OverviewEdit;
