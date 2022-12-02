import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';
import useIOSScroll from 'src/hooks/useIOSScroll';
import { RootState } from 'src/reducers';

import CreateDescriptionInput from '../../components/create-meeting/CraeteDescriptionInput';
import CreateTitleInput from '../../components/create-meeting/CraeteTitleInput';
import CreateAttachmentInput from '../../components/create-meeting/CreateAttachmentInput';
import BottomButton from 'src/components/common/BottomButton';
import CreateLocationSelect from 'src/components/create-meeting/CreateLocationSelect';

// TODO 이 부분 react-hook-form 으로 변경하면 좋을 것 같음
interface CreateInfoErrorForm {
  title: string;
  description: string;
  attachment: string;
  addressDetail: string;
}

function MeetingInfoForm() {
  useIOSScroll();

  const { eventTitle } = useSelector((state: RootState) => state.createMeeting);

  const [error, setError] = useState<CreateInfoErrorForm>({
    title: '',
    description: '',
    attachment: '',
    addressDetail: '',
  });
  const setTitleError = (newVal: string) => {
    setError((prev) => ({ ...prev, title: newVal }));
  };
  const setDescriptionError = (newVal: string) => {
    setError((prev) => ({ ...prev, description: newVal }));
  };
  const setAddressDetailError = (newVal: string) => {
    setError((prev) => ({ ...prev, addressDetail: newVal }));
  };
  const setAttachmentError = (newVal: string) => {
    setError((prev) => ({ ...prev, attachment: newVal }));
  };

  // useEffect(() => {
  //   if (isMobile && isIOS) {
  //     if (focused) {
  //       focusDisable();
  //     } else {
  //       focusEnable();
  //     }
  //   }
  // }, [focused]);

  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate(PathName.createTime);
  };

  const nextButtonDisabled =
    !eventTitle ||
    !!error.title ||
    !!error.attachment ||
    !!error.description ||
    !!error.addressDetail;

  return (
    <div className={'create-wrapper'}>
      <div className={'padding-wrapper'}>
        <div className={'description-text'}>
          {'이번 미팅에 대해'}
          <br />
          {'알려주세요'}
        </div>
        <CreateTitleInput error={error.title} setError={setTitleError} />
        <div
          className={classNames('meeting-info', 'additional', {
            'is-error': !!error.attachment,
          })}
        >
          <CreateLocationSelect
            error={error.addressDetail}
            setError={setAddressDetailError}
          />
          <CreateDescriptionInput
            error={error.description}
            setError={setDescriptionError}
          />
          <CreateAttachmentInput
            isDescriptionError={!!error.description}
            error={error.attachment}
            setError={setAttachmentError}
          />
        </div>
        <BottomButton
          disabled={nextButtonDisabled}
          onClick={handleNextClick}
          text="다음"
        />
      </div>
    </div>
  );
}

export default MeetingInfoForm;
