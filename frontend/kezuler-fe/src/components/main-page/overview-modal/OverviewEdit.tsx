import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { OVERVIEW_FORM_ID, PLACE_OPTIONS } from 'src/constants/Main';
import { makeFixedInfoUrl, makePendingInfoUrl } from 'src/constants/PathName';
import {
  INVALID_URL_ERROR,
  MAX_ATTACHMENT_LENGTH,
  MAX_ATTACHMENT_LENGTH_ERROR,
  MAX_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH_ERROR,
  MAX_OFFLINE_LOCATION_LENGTH,
  MAX_OFFLINE_LOCATION_LENGTH_ERROR,
  MAX_ONLINE_LOCATION_LENGTH,
  MAX_ONLINE_LOCATION_LENGTH_ERROR,
  MAX_TITLE_LENGTH,
  MAX_TITLE_LENGTH_ERROR,
  REQUIRED_ERROR,
} from 'src/constants/Validation';
import useMainFixed from 'src/hooks/useMainFixed';
import useMainPending from 'src/hooks/useMainPending';
import { BFixedEvent } from 'src/types/fixedEvent';
import { OverviewEventForm } from 'src/types/Overview';
import { BPendingEvent } from 'src/types/pendingEvent';
import isURL from 'src/utils/isURL';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewDropdown from './OverviewDropdown';
import OverviewParticipants from './OverviewParticipants';
import OverviewSection from './OverviewSection';
import KezulerDropdown from 'src/components/common/KezulerDropdown';
import OverviewTextarea from 'src/components/main-page/overview-modal/OverviewTextarea';

import { ReactComponent as ArrowDownIcon } from 'src/assets/icn_dn_outline.svg';
import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';

import { patchFixedEventById } from 'src/api/fixedEvent';
import { patchPendingEventsById } from 'src/api/pendingEvent';

interface Props {
  eventDate: string;
  event: BFixedEvent | BPendingEvent;
  isCanceled?: boolean;
  isPassed?: boolean;
}

const usePatchEvent = () => {
  const [loading, setLoading] = useState(false);
  // TODO
  const { getPendingEvents } = useMainPending();
  const { getFixedEvents } = useMainFixed();

  const patch = (
    isFixedEvent: boolean,
    eventId: string,
    params: OverviewEventForm,
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

function OverviewEdit({ eventDate, event, isCanceled, isPassed }: Props) {
  const {
    eventId,
    eventTitle,
    eventDescription,
    eventAttachment,
    eventZoomAddress,
    eventPlace,
    eventHost: { userName: hostName, userProfileImage: hostProfileImage },
  } = event;
  const navigate = useNavigate();

  const { loading, patch } = usePatchEvent();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<OverviewEventForm>({ mode: 'onChange' });

  const onValid: SubmitHandler<OverviewEventForm> = (data) => {
    patch(isFixedEvent(event), eventId, data, () => {
      navigate(
        (isFixedEvent(event) ? makeFixedInfoUrl : makePendingInfoUrl)(eventId)
      );
    });
  };

  const [selectedPlaceIdx, setSelectedPlaceIdx] = useState(eventPlace ? 1 : 0);

  useEffect(() => {
    if (selectedPlaceIdx === 0) {
      setValue('eventPlace', '');
      clearErrors('eventPlace');
    } else {
      setValue('eventZoomAddress', '');
      clearErrors('eventZoomAddress');
    }
  }, [selectedPlaceIdx]);

  const isSelectOnline = selectedPlaceIdx === 0;

  const checkURL = (target: string) => {
    if (target && !isURL(target)) {
      return INVALID_URL_ERROR;
    }
    return true;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === 'Enter') {
      const form = document.forms[0];
      const index = Array.prototype.indexOf.call(form, event.target);
      //TODO: 원래 제대로 적용되게끔하기
      const indexList = [0, 2, 3, 5];
      const nowIndex = indexList.findIndex((i) => i === index);
      if (nowIndex + 1 < indexList.length) {
        const focusEl: any = form.elements[indexList[nowIndex + 1]];
        focusEl.focus();
      }
      // event.preventDefault();
    }
  };

  return (
    <form id={OVERVIEW_FORM_ID} onSubmit={handleSubmit(onValid)}>
      <header className={'overview-header'}>
        <div className={'overview-header-title'}>미팅 제목</div>
        <h1 className={'overview-header-desc'}>
          <OverviewTextarea
            textareaClassName={'overview-title-input'}
            error={errors.eventTitle}
            placeholder={'미팅 제목을 입력하세요.'}
            registered={register('eventTitle', {
              required: REQUIRED_ERROR,
              maxLength: {
                value: MAX_TITLE_LENGTH,
                message: MAX_TITLE_LENGTH_ERROR,
              },
            })}
            defaultValue={eventTitle}
          />
        </h1>
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
            <OverviewTextarea
              key={'online'}
              textareaClassName={'overview-body-input'}
              error={errors.eventZoomAddress}
              placeholder={'링크를 입력하세요. (선택)'}
              registered={register('eventZoomAddress', {
                maxLength: {
                  value: MAX_ONLINE_LOCATION_LENGTH,
                  message: MAX_ONLINE_LOCATION_LENGTH_ERROR,
                },
                validate: {
                  isURL: checkURL,
                },
              })}
              defaultValue={eventZoomAddress}
            />
          ) : (
            <OverviewTextarea
              key={'offline'}
              textareaClassName={'overview-body-input'}
              error={errors.eventPlace}
              placeholder={'장소정보나 주소를 입력하세요. (선택)'}
              registered={register('eventPlace', {
                required: REQUIRED_ERROR,
                maxLength: {
                  value: MAX_OFFLINE_LOCATION_LENGTH,
                  message: MAX_OFFLINE_LOCATION_LENGTH_ERROR,
                },
              })}
              defaultValue={eventPlace}
            />
          )}
        </OverviewSection>
        <OverviewSection title={'미팅 내용'}>
          <OverviewTextarea
            textareaClassName={'overview-body-input'}
            error={errors.eventDescription}
            placeholder={'미팅 내용을 입력하세요. (선택)'}
            registered={register('eventDescription', {
              maxLength: {
                value: MAX_DESCRIPTION_LENGTH,
                message: MAX_DESCRIPTION_LENGTH_ERROR,
              },
            })}
            defaultValue={eventDescription}
          />
        </OverviewSection>
        <OverviewSection title={'참조 링크'}>
          <OverviewTextarea
            textareaClassName={'overview-body-input'}
            error={errors.eventAttachment}
            placeholder={'URL주소를 입력해주세요. (선택)'}
            registered={register('eventAttachment', {
              maxLength: {
                value: MAX_ATTACHMENT_LENGTH,
                message: MAX_ATTACHMENT_LENGTH_ERROR,
              },
              validate: {
                isURL: checkURL,
              },
            })}
            defaultValue={eventAttachment}
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
