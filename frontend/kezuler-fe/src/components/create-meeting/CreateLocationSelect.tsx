import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import classNames from 'classnames';

import { PLACE_OPTIONS } from 'src/constants/CreateMeeting';
import {
  INVALID_URL_ERROR,
  MAX_OFFLINE_LOCATION_LENGTH,
  MAX_OFFLINE_LOCATION_LENGTH_ERROR,
  MAX_ONLINE_LOCATION_LENGTH,
  MAX_ONLINE_LOCATION_LENGTH_ERROR,
} from 'src/constants/Validation';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import isURL from 'src/utils/isURL';

import KezulerDropdown from 'src/components/common/KezulerDropdown';

import { ReactComponent as ArrowDownIcon } from 'src/assets/icn_dn_outline.svg';
import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';

interface Props {
  setError: (newVal: string) => void;
  error: string;
}

// TODO redux + KezulerDropdown 으로 인해 불필요한 단계가 하나 더 생긴 것 같음
//  KezulerDropdown 이 아니라 일반 dropdown 으로 변경하는 것이 효율적일까?
function CreateLocationSelect({ setError, error }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { setAddressType, setAddressDetail } = createMeetingActions;

  const { addressType, addressDetail } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const [selectedPlaceIdx, setSelectedPlaceIdx] = useState(0);

  useEffect(() => {
    if (selectedPlaceIdx === 0) {
      dispatch(setAddressType('ON'));
    } else {
      dispatch(setAddressType('OFF'));
    }
    dispatch(setAddressDetail(''));
  }, [selectedPlaceIdx]);

  const isSelectOnline = selectedPlaceIdx === 0;

  const placeholder = isSelectOnline
    ? '링크를 입력하세요. (선택)'
    : '장소정보나 주소를 입력하세요. (필수)';

  useEffect(() => {
    if (addressType === 'ON') {
      let attachmentError = '';
      if (addressDetail) {
        if (addressDetail.length > MAX_ONLINE_LOCATION_LENGTH) {
          attachmentError = MAX_ONLINE_LOCATION_LENGTH_ERROR;
        } else if (!isURL(addressDetail)) {
          attachmentError = INVALID_URL_ERROR;
        }
      }
      setError(attachmentError);
      return;
    }

    const placeError =
      addressDetail.length > MAX_OFFLINE_LOCATION_LENGTH
        ? MAX_OFFLINE_LOCATION_LENGTH_ERROR
        : '';
    setError(placeError);
  }, [addressType, addressDetail]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setAddressDetail(event.target.value));
  };

  return (
    <>
      <div className={classNames('meeting-additional')}>
        <span className={classNames('meeting-additional-text')}>장소</span>
        <span className={classNames('meeting-additional-additional')}>
          선택사항
        </span>
      </div>
      <div className={'meeting-field-location'}>
        <KezulerDropdown
          startIcon={isSelectOnline ? <PCIcon /> : <LocIcon />}
          endIcon={<ArrowDownIcon />}
          menuData={PLACE_OPTIONS}
          displayKey={'display'}
          selectedIdx={selectedPlaceIdx}
          setSelectedIdx={setSelectedPlaceIdx}
          buttonClassName={'meeting-field-location-btn'}
          menuClassName={'meeting-field-location-menu'}
          fitToButtonWidth
        />
        <div className={'meeting-field-location-container'}>
          <TextareaAutosize
            className={classNames(
              'meeting-field-title-and-reference',
              'location',
              {
                error,
              }
            )}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            value={addressDetail}
            onChange={handleInputChange}
          />
          {error && <div className={'create-meeting-error-text'}>{error}</div>}
        </div>
      </div>
    </>
  );
}

export default CreateLocationSelect;
