import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import useGetUserInfo from 'src/hooks/useGetUserInfo';
import useIsLoggedIn from 'src/hooks/useIsLoggedIn';

import AcceptMeeting from 'src/views/accept-meeting';
import AcceptanceCompletion from 'src/views/accept-meeting/AcceptanceCompletion';
import AcceptIndex from 'src/views/accept-meeting/AcceptIndex';
import Invitation from 'src/views/accept-meeting/Invitation';
import SelectionModifier from 'src/views/accept-meeting/SelectionModifier';
import TimeListSelector from 'src/views/accept-meeting/TimeListSelector';
import CreateMeeting from 'src/views/create-meeting';
import CalendarTimeSelector from 'src/views/create-meeting/CalendarTimeSelector';
import MeetingInfoForm from 'src/views/create-meeting/MeetingInfoForm';
import MeetingShare from 'src/views/create-meeting/MeetingShare';
import OnOffSelector from 'src/views/create-meeting/OnOffSelector';
import SelectedOptions from 'src/views/create-meeting/SelectedOptions';
import KakaoRedirect from 'src/views/KakaoRedirect';
import Login from 'src/views/Login';
import MainPage from 'src/views/MainPage';
import MyPage from 'src/views/MyPage';
import NotFound from 'src/views/NotFound';
import TimeConfirmator from 'src/views/pending-event/TimeConfirmator';
import RedirectView from 'src/views/RedirectView';
import MainFixedEvents from 'src/components/main-page/main-fixed-events';
import MainPendingEvents from 'src/components/main-page/main-pending-events';
import OverviewModal from 'src/components/main-page/overview-modal';
import PrivacyPolicy from 'src/components/my-page/PrivacyPolicy';
import TermsOfService from 'src/components/my-page/TermsOfService';
import ParticipantsPopup from 'src/components/participants-popup';

// TODO kakao redirect 가 isLoggedIn true 일 때도 있어야하는데, 순서가 맞게 되어있는지 확인 필요
function RootRoutes() {
  const isLoggedIn = useIsLoggedIn();
  const location = useLocation();

  // TODO 리덕스 필요한지 확인 필요
  const { getUserInfo } = useGetUserInfo();
  useEffect(() => {
    if (isLoggedIn) {
      getUserInfo();
    }
  }, [isLoggedIn]);

  // 경로에 맞게 HTML Meta Title 수정
  useEffect(() => {
    let title = '케줄러 - 일잘러들을 위한 스마트 스케줄러';
    const mainRegex = /^\/main\/.+\/.+\/info/;
    const pathname = location.pathname;
    if (pathname.startsWith('/mypage')) {
      title = '마이페이지 - 케줄러';
    } else if (pathname.startsWith('/create')) {
      title = '미팅 생성 - 케줄러';
    } else if (pathname.startsWith('/invite')) {
      title = '미팅 시간 투표 - 케줄러';
    } else if (pathname.match(mainRegex)) {
      title = '미팅 정보 - 케줄러';
    }

    const htmlTitle = document.querySelector('title');
    if (htmlTitle) {
      htmlTitle.innerHTML = title;
    }
  }, [location.pathname]);

  return (
    <>
      {isLoggedIn ? (
        <main>
          <Routes>
            <Route
              index
              element={<Navigate replace to={PathName.mainFixed} />}
            />
            <Route
              path={PathName.mainFixedIdInfoParticipants}
              element={<ParticipantsPopup />}
            />
            <Route
              path={PathName.mainPendingIdParticipants}
              element={<ParticipantsPopup />}
            />
            <Route path={PathName.main} element={<MainPage />}>
              <Route
                index
                element={<Navigate replace to={PathName.mainFixed} />}
              />
              <Route path={PathName.mainFixed} element={<MainFixedEvents />}>
                <Route
                  path={PathName.mainFixedIdInfo}
                  element={<OverviewModal />}
                />
                <Route
                  path={PathName.mainFixedIdInfoEdit}
                  element={<OverviewModal />}
                />
              </Route>

              <Route
                path={PathName.mainPending}
                element={<MainPendingEvents />}
              >
                <Route
                  path={PathName.mainPendingIdInfo}
                  element={<OverviewModal />}
                />
                <Route
                  path={PathName.mainPendingIdInfoEdit}
                  element={<OverviewModal />}
                />
              </Route>

              <Route
                path="*"
                element={<Navigate replace to={PathName.mainFixed} />}
              />
            </Route>
            {/* <Route path={PathName.notification} element={<NotiPage />} /> */}
            <Route path={PathName.myPage} element={<MyPage />} />
            <Route path={PathName.privacyPolicy} element={<PrivacyPolicy />} />
            <Route path={PathName.serviceTerm} element={<TermsOfService />} />
            <Route path={PathName.create} element={<CreateMeeting />}>
              <Route
                index
                element={<Navigate replace to={PathName.createInfo} />}
              />
              <Route path={PathName.createInfo} element={<MeetingInfoForm />} />
              <Route
                path={PathName.createTime}
                element={<CalendarTimeSelector />}
              />
              <Route
                path={PathName.createCheck}
                element={<SelectedOptions />}
              />
              <Route path={PathName.createPlace} element={<OnOffSelector />} />
              <Route
                path={PathName.createComplete}
                element={<MeetingShare />}
              />
              <Route
                path="*"
                element={<Navigate replace to={PathName.createInfo} />}
              />
            </Route>
            <Route path={PathName.modify} element={<SelectionModifier />} />
            <Route
              path={PathName.modifyParticipants}
              element={<ParticipantsPopup />}
            />
            <Route
              path={`${PathName.confirm}/:eventConfirmId`}
              element={<TimeConfirmator />}
            />
            <Route
              path={`${PathName.confirm}/:eventConfirmId/participants`}
              element={<ParticipantsPopup />}
            />
            <Route
              path={`${PathName.invite}/:eventId`}
              element={<AcceptMeeting />}
            >
              <Route index element={<AcceptIndex />} />
              <Route
                path={PathName.inviteInvitation}
                element={<Invitation />}
              />
              <Route
                path={PathName.inviteSelect}
                element={<TimeListSelector />}
              />
              <Route
                path={PathName.inviteSelectParticipants}
                element={<ParticipantsPopup />}
              />
              <Route
                path={PathName.inviteComplete}
                element={<AcceptanceCompletion />}
              />
              <Route path="*" element={<AcceptIndex />} />
            </Route>
            <Route path={PathName.kakaoRedirect} element={<KakaoRedirect />} />
            {/* <Route
              path={'test'}
              element={
                // <MeetingShare />
                <AcceptanceCompletion />
                // <CompletionPage
                //   boldTextFirst="미팅 시간이"
                //   boldTextSecond="확정되었습니다."
                //   regularTextFirst="미팅 참여자들에게"
                //   regularTextSecond="확정된 일정이 전송되었습니다."
                // />
              }
            /> */}
            <Route path={PathName.notFound} element={<NotFound />} />
            <Route
              path="*"
              element={<Navigate replace to={PathName.notFound} />}
            />
          </Routes>
        </main>
      ) : (
        <main>
          <Routes>
            <Route index element={<Navigate replace to={PathName.login} />} />
            <Route
              path={`${PathName.invite}/:eventId`}
              element={<AcceptMeeting />}
            >
              <Route index element={<AcceptIndex />} />
              <Route
                path={PathName.inviteInvitation}
                element={<Invitation />}
              />
              <Route path="*" element={<AcceptIndex />} />
            </Route>
            <Route path={PathName.create} element={<CreateMeeting />}>
              <Route
                index
                element={<Navigate replace to={PathName.createInfo} />}
              />
              <Route path={PathName.createInfo} element={<MeetingInfoForm />} />
              <Route
                path={PathName.createTime}
                element={<CalendarTimeSelector />}
              />
              <Route
                path={PathName.createCheck}
                element={<SelectedOptions />}
              />
              <Route path={PathName.createPlace} element={<OnOffSelector />} />
              <Route
                path={PathName.createComplete}
                element={<MeetingShare />}
              />
              <Route
                path="*"
                element={<Navigate replace to={PathName.createInfo} />}
              />
            </Route>
            <Route path={PathName.myPage} element={<MyPage />} />
            <Route path={PathName.login} element={<Login />}>
              <Route path="*" element={<Login />} />
            </Route>
            <Route path={PathName.kakaoRedirect} element={<KakaoRedirect />} />
            <Route path={PathName.notFound} element={<NotFound />} />
            <Route path="*" element={<RedirectView />} />
          </Routes>
        </main>
      )}
    </>
  );
}

export default RootRoutes;
