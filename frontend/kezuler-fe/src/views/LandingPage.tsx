import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';

import Alim1 from 'src/assets/image/alimtalk1.png';
import Alim2 from 'src/assets/image/alimtalk2.png';
import Cloud1 from 'src/assets/image/cloud1.png';
import Cloud2 from 'src/assets/image/cloud2.png';
import Calendar1 from 'src/assets/image/connect_calendar1.png';
import Calendar2 from 'src/assets/image/connect_calendar2.png';
import Create1 from 'src/assets/image/create_meeting1.png';
import Create2 from 'src/assets/image/create_meeting2.png';
import Invite1 from 'src/assets/image/invite_meeting1.png';
import Invite2 from 'src/assets/image/invite_meeting2.png';
// import KakaoTeam from 'src/assets/image/kakao_team.png';
// import KezulerLink from 'src/assets/image/kezuler_link.png';
import ImgOverview from 'src/assets/image/landing-overview.png';
import ImgStorageView from 'src/assets/image/landing-storage.png';
// import Participants1 from 'src/assets/image/participants1.png';
// import Participants2 from 'src/assets/image/participants2.png';
import Schedule1 from 'src/assets/image/schedule_manage1.png';
import ImgYearEndKezuler from 'src/assets/image/year-end-kezuler-talk.png';
import ImgYearEndTalk from 'src/assets/image/year-end-talk.png';
import { ReactComponent as KezulerLogo } from 'src/assets/logo_kezuler.svg';
import 'src/styles/landing.scss';

function LandingPage() {
  const navigate = useNavigate();
  const getOverlapImgs = (img1: string, img2: string) => {
    return (
      <div className={'landing-image-overlap-wrapper'}>
        <div className={'landing-image-overlap'}>
          <img src={img1} className={classNames('landing-image', 'overlap1')} />
          <img src={img2} className={classNames('landing-image', 'overlap2')} />
        </div>
      </div>
    );
  };

  const handleKezulerClick = () => {
    navigate(PathName.mainFixed);
  };

  return (
    <div>
      <header className={'landing-header'}>
        <KezulerLogo />
        <div className={'landing-header-btn'} onClick={handleKezulerClick}>
          케:줄러 바로가기
        </div>
      </header>

      <section className={'landing-head-section'}>
        <h1>
          <span>
            <span className={classNames('font-20')}>모임,</span>
            <br />
            <span className={classNames('font-25', 'font-red')}>
              시작도 안했는데
            </span>
            <br />
            <span className={classNames('font-35')}>벌써 숨막히니?😿</span>
          </span>
        </h1>
        <img src={ImgYearEndTalk} className={'landing-image'} />
        <h1>
          <span>
            <span className={classNames('font-20')}>케:줄러는</span>
            <br />
            <span className={classNames('font-35', 'font-highlight')}>
              단 하나의 링크에
            </span>
            <br />
            <span className={classNames('font-20')}>모든 과정을 담았어요.</span>
            <br />
            <span className={classNames('font-35')}>😆</span>
          </span>
        </h1>
        <img src={ImgYearEndKezuler} className={'landing-image'} />
        <h1>
          <span>
            <span className={classNames('font-20')}>
              시간 조율 뿐만 아니라,{' '}
            </span>
            <br />
            <span className={classNames('font-30')}>관련 정보를 </span>
            <span className={classNames('font-30', 'font-highlight')}>
              한눈에!
            </span>
            <br />
          </span>
        </h1>
        {getOverlapImgs(ImgOverview, ImgStorageView)}
      </section>

      <section className={'landing-main-section'}>
        <div>
          <h1>
            <span className={classNames('font-30')}>미팅 생성</span>
          </h1>
          <div>
            <p>
              <span className={classNames('font-15', 'font-light-blue')}>
                미팅 시간 투표 기능을 통해
              </span>
            </p>
            <p>
              <span className={classNames('font-15')}>
                미팅 일정을 만들어봐요.
              </span>
            </p>
          </div>
        </div>
        {getOverlapImgs(Create1, Create2)}

        <div>
          <h1>
            <span className={classNames('font-30')}>미팅 초대</span>
          </h1>
          <div>
            <p>
              <span className={classNames('font-15')}>
                초간단 미팅 참여 프로세스로
              </span>
            </p>
            <p>
              <span className={classNames('font-15', 'font-light-blue')}>
                누구나 쉽게 미팅에 참여할 수 있어요.
              </span>
            </p>
          </div>
        </div>
        {getOverlapImgs(Invite1, Invite2)}

        <div>
          <h1>
            <span className={classNames('font-30')}>알림톡 리마인더</span>
          </h1>
          <div>
            <p>
              <span className={classNames('font-15')}>
                미팅시각 전에 일일이 메세지 보내지 않아도
              </span>
            </p>
            <p>
              <span className={classNames('font-15')}>
                케줄러가{' '}
                <span className={'font-light-blue'}>
                  자동으로 리마인더를 보내줘요!
                </span>
              </span>
            </p>
          </div>
        </div>
        {getOverlapImgs(Alim2, Alim1)}

        <div>
          <h1>
            <span className={classNames('font-30')}>미팅 일정 관리</span>
          </h1>
          <div>
            <p>
              <span className={classNames('font-15')}>
                나의{' '}
                <span className={'font-light-blue'}>
                  모든 미팅 일정을 한눈에 보고
                </span>
              </span>
            </p>
            <p>
              <span className={classNames('font-15')}>
                해당 미팅정보를 바로 확인할 수 있어요!
              </span>
            </p>
          </div>
        </div>
        {getOverlapImgs(Schedule1, Alim1)}

        <div>
          <h1>
            <span className={classNames('font-30')}>캘린더 연동</span>
          </h1>
          <div>
            <p>
              <span className={classNames('font-15')}>
                케줄러의 일정이{' '}
                <span className={'font-light-blue'}>
                  내 캘린더로 자동 추가!
                </span>
              </span>
            </p>
            <p>
              <span className={classNames('font-15')}>
                <span className={'font-light-blue'}>내 일정을 보면서</span>{' '}
                시간을 결정할 수 있어요.
              </span>
            </p>
          </div>
        </div>
        {getOverlapImgs(Calendar1, Calendar2)}

        <div>
          <h1>
            <span className={classNames('font-30')}>보관함 클라우드</span>
          </h1>
          <div>
            <p>
              <span className={classNames('font-15')}>
                모든 일정에는 참여자들과 공유할 수 있는
              </span>
            </p>
            <p>
              <span className={classNames('font-15')}>
                <span className={'font-light-blue'}>보관함 클라우드</span>가
                있어요!
              </span>
            </p>
          </div>
        </div>
        {getOverlapImgs(Cloud1, Cloud2)}
      </section>
      <section className={'landing-bottom-section'}>
        <h1>
          <span className={'font-30'}>
            이젠 미팅도 <span className={'font-highlight'}>스마트하게!</span>
          </span>
        </h1>
        <h1>
          <span className={'font-25'}>지금 바로 경험해보세요!</span>
        </h1>
      </section>
      <footer className={'landing-footer'}>
        <b>(주)올렌다</b> 대표이사 김수아, 오태인
        <br />
        서울특별시 관악구 신림로 140 2층(신림동) <br />
        사업자 등록번호 736-87-01642 <br />
        <a href={PathName.privacyPolicy}>개인정보 보호정책</a> <span> / </span>
        <a href={PathName.serviceTerm}>이용약관</a>
      </footer>

      <div className={'landing-fixed-btn'} onClick={handleKezulerClick}>
        케:줄러 바로가기
      </div>
    </div>
  );
}

export default LandingPage;
