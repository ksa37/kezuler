import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useGoogleLogin } from '@react-oauth/google';

import {
  ACCESS_TOKEN_KEY,
  CURRENT_HOST,
  CURRENT_USER_INFO_KEY,
  GOOGLE_LOGIN_SCOPE,
  REFRESH_TOKEN_KEY,
} from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import {
  getTimezoneGroupIdx,
  TIME_ZONE_GROUPS,
  // TIME_ZONE_LIST,
} from 'src/constants/TimeZones';
import useDialog from 'src/hooks/useDialog';
import useGetUserInfo from 'src/hooks/useGetUserInfo';
import { usePatchUser } from 'src/hooks/usePatchUser';
import { deleteCookie } from 'src/utils/cookie';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import GoogleToggleOn from '../common/GoogleToogleOn';
import GoogleToggleOff from '../common/GoogleToogleOn copy';
import TimezoneButton from '../common/TimezoneDropdown';
import MyPageRow from './MyPageRow';

import { ReactComponent as CalenderIcon } from 'src/assets/icn_calender_yb.svg';
import { ReactComponent as ClockIcon } from 'src/assets/icn_clock_yb.svg';
import { ReactComponent as EditIcon } from 'src/assets/icn_edit.svg';
import { ReactComponent as LogoutIcon } from 'src/assets/icn_logout_yb.svg';
import { ReactComponent as PaperIcon } from 'src/assets/icn_paper_yb.svg';
import { ReactComponent as QuestionIcon } from 'src/assets/icn_question_yb.svg';
import { ReactComponent as ToggleOffIcon } from 'src/assets/toggle_off.svg';
import { ReactComponent as ToggleOnIcon } from 'src/assets/toggle_on.svg';
import 'src/styles/myPage.scss';

import { deleteCalendarConnect, getGoogleAccount } from 'src/api/calendar';
import { deleteUser, patchUserTimeZone } from 'src/api/user';

interface Props {
  goToEdit: () => void;
}

function MyPageMain({ goToEdit }: Props) {
  const { userTimezone, userProfileImage, userEmail, userName, googleToggle } =
    useMemo(() => ({ ...getCurrentUserInfo() }), []);

  const navigate = useNavigate();
  const { openDialog } = useDialog();

  //TODO 구글 캘린더 연동
  const [isCalendarPaired, setIsCalendarPaired] = useState(googleToggle);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState('Asia');

  const { changeUser, loading } = usePatchUser();
  const { getUserInfo } = useGetUserInfo();

  // 화면 진입 시 선택되어있는 타임존 찾아옴
  useEffect(() => {
    const currentTimezone =
      userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTimezoneGroup = currentTimezone.split('/')[0];
    const targetIdx = TIME_ZONE_GROUPS[
      getTimezoneGroupIdx(currentTimezoneGroup)
    ].zones.findIndex((t) => t.value === currentTimezone);
    if (targetIdx !== -1) {
      setSelectedGroup(currentTimezoneGroup);
      setSelectedIdx(targetIdx);
    }
  }, [userTimezone]);

  const patchTimeZone = (newGroup: string, newIdx: number) => {
    const before = selectedIdx;
    setSelectedGroup(newGroup);
    setSelectedIdx(newIdx);
    const groupIdx = getTimezoneGroupIdx(newGroup);
    changeUser(
      patchUserTimeZone({
        timeZone: TIME_ZONE_GROUPS[groupIdx].zones[newIdx].value,
      }),
      {
        onSuccess: () => {
          getUserInfo();
        },
        onError: () => {
          setSelectedIdx(before);
        },
      }
    );
  };

  const handleLogoutClick = () => {
    openDialog({
      title: `로그아웃 하시겠습니까?`,
      onConfirm: () => {
        deleteCookie(ACCESS_TOKEN_KEY);
        deleteCookie(REFRESH_TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_INFO_KEY);
        location.reload();
      },
    });
  };

  const handleEditClick = () => {
    goToEdit();
  };

  const handleCalendarToggle = () => {
    if (isCalendarPaired !== null || undefined) {
      if (isCalendarPaired) {
        openDialog({
          title: `구글캘린더 연동을 해제하시겠습니까?`,
          description: '해제 시, 해당 캘린더 정보는 연동되지 않습니다.',
          onConfirm: () =>
            changeUser(deleteCalendarConnect(), {
              onSuccess: () => {
                getUserInfo();
                setIsCalendarPaired(!isCalendarPaired);
              },
            }),
        });
      }
    }
  };

  const handleGoogleSuccess = (res: any) => {
    changeUser(
      getGoogleAccount(res.code),
      {
        onSuccess: () => {
          getUserInfo();
          setIsCalendarPaired(!isCalendarPaired);
        },
      },
      true
    );
  };

  const connectGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    flow: 'auth-code',
    scope: GOOGLE_LOGIN_SCOPE,
  });

  const checkIos = () => {
    const Agent = navigator.userAgent;

    const checkIosPage = () => {
      const mobile = document.createElement('meta');
      mobile.name = 'viewport';
      mobile.content =
        'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, minimal-ui';
      document.getElementsByTagName('head')[0].appendChild(mobile);
      document.body.innerHTML =
        "<style>body{margin:0;padding:0;overflow: hidden;height: 100%;}</style><h2 style='padding-top:50px; text-align:center;'>인앱브라우저 호환문제로 인해<br />Safari로 접속해야합니다.</h2><article style='text-align:center; font-size:17px; word-break:keep-all;color:#999;'>아래 버튼을 눌러 Safari를 실행해주세요<br />Safari가 열리면, 주소창을 길게 터치한 뒤,<br />'붙여놓기 및 이동'을 누르면<br />정상적으로 이용할 수 있습니다.<br /><br /><button onclick='inappbrowserout();' style='min-width:180px;margin-top:10px;height:54px;font-weight: 700;background-color:#fad94f;color:#000;border-radius: 4px;font-size:17px;border:0;'>Safari로 열기</button></article><img style='width:70%;margin:50px 15% 0 15%' src='https://tistory3.daumcdn.net/tistory/1893869/skin/images/inappbrowserout.jpeg' />";
    };

    if (Agent.match(/iPhone|iPad/i)) {
      if (Agent.toLowerCase().includes('kakao')) {
        checkIosPage();
      } else if (Agent.toLowerCase().includes('naver')) {
        checkIosPage();
      } else if (Agent.includes('instagram')) {
        checkIosPage();
      } else {
        connectGoogle();
      }
    } else {
      connectGoogle();
    }
  };

  const handleGooglelogin = () => {
    openDialog({
      title: `구글 캘린더 연동`,
      description:
        '확정된 일정을 자동으로 등록하고,\n 일정을 확인해 중복 예약을 \n 방지할 수 있습니다.',
      onConfirm: checkIos,
    });
  };

  const handleTermsClick = () => {
    navigate(PathName.serviceTerm);
  };

  const handlePrivacyPolicyClick = () => {
    navigate(PathName.privacyPolicy);
  };

  const handleDeleteAccountClick = () => {
    openDialog({
      title: `정말 탈퇴하시겠습니까?`,
      description: '탈퇴 시, 계정이 즉시 삭제되며 되돌릴 수 없습니다.',
      onConfirm: () => {
        deleteUser();
        deleteCookie(ACCESS_TOKEN_KEY);
        deleteCookie(REFRESH_TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_INFO_KEY);
        // navigate(PathName.main);
        location.href = `${CURRENT_HOST}`;
      },
    });
  };

  return (
    <>
      {/* <div className={'my-page-profile-wrapper'}> */}
      <div className={'my-page-profile'}>
        <Avatar
          className={'my-page-profile-avatar'}
          src={userProfileImage}
          alt={userName}
        />
        <div className={'my-page-profile-main'}>
          <div className={'my-page-profile-name'}>{userName}</div>
          <div className={'my-page-profile-email'}>{userEmail}</div>
        </div>
        <Button
          onClick={handleEditClick}
          classes={{
            root: 'my-page-profile-edit-btn',
            startIcon: 'my-page-profile-edit-btn-icn',
          }}
          startIcon={<EditIcon />}
        >
          편집하기
        </Button>
      </div>
      <h1 className={'my-page-h1'}>미팅 정보</h1>
      <MyPageRow title={'캘린더 연동'} startIcon={<CalenderIcon />}>
        {isCalendarPaired ? (
          // <ToggleOnIcon
          //   className={'calendar-toggle'}
          //   onClick={handleCalendarToggle}
          // />
          <GoogleToggleOff
            userEmail={userEmail}
            onClick={handleCalendarToggle}
          />
        ) : (
          // <ToggleOffIcon
          // className={'calendar-toggle'}
          // onClick={handleGooglelogin}
          // />
          <GoogleToggleOn onClick={handleGooglelogin} />
        )}
      </MyPageRow>
      <MyPageRow title={'타임존 설정'} startIcon={<ClockIcon />}>
        <TimezoneButton
          disabled={loading}
          selectedIdx={selectedIdx}
          selectedGroup={selectedGroup}
          setSelectedZone={patchTimeZone}
        />
      </MyPageRow>
      <h1 className={'my-page-h1'}>서비스 이용</h1>
      <MyPageRow
        title={'이용문의'}
        href={'mailto:kezuler@gmail.com'}
        startIcon={<QuestionIcon />}
      />
      <MyPageRow
        title={'이용약관'}
        onClick={handleTermsClick}
        startIcon={<PaperIcon />}
      />
      <MyPageRow
        title={'개인정보 보호 정책'}
        onClick={handlePrivacyPolicyClick}
        startIcon={<PaperIcon />}
      />
      <MyPageRow
        // href={PathName.login}
        onClick={handleLogoutClick}
        title={'로그아웃'}
        startIcon={<LogoutIcon />}
      />
      <div className={'delete-account-btn-wrapper'}>
        <span
          className={'delete-account-btn'}
          onClick={handleDeleteAccountClick}
        >
          탈퇴하기
        </span>
      </div>
    </>
  );
}

export default MyPageMain;
