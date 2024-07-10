# Kezuler

## Preview
*미팅을 스마트하게 잡을 수 있도록 도와주는 스마트 스케줄러* <br><br>
학교에서 조별과제를 하거나 미팅이 잦은 일을 하는 경우, 모임 약속을 잡고 관련된 정보를 찾는데 많은 시간을 필요로 하게 된다. 
약속을 잡으려면 여러 번 메시지가 핑퐁이 되어야 하고, 빨리 일정을 잡아야 하는 입장에서는 답답하기 일쑤다.
이러한 문제점을 해결하기 위해 일정 기반 클라우드 스케줄러인 케줄러를 만들게 되었다. 

## Tech Stack
- **Frontend**: React, Typescript
- **Backend**: Spring, Java
- **Others**: Github Actions, AWS EC2 & Load Balancer, AWS S3 & Cloudfront
<br>
(참고) 해당 레포는 프론트엔드 코드만 있음

## How To Install
```bash
# Clone the repo
git clone https://github.com/ksa37/kezuler.git

# Install
cd ./frontend/kezuler-fe
yarn install

# Run
yarn start

```
http://localhost:3000 접속하면 프로젝트를 볼 수 있다.
<br><br>

## Project Details
### 홈
<img width="200" alt="스크린샷 2023-11-15 오후 11 36 52" src="https://github.com/ksa37/kezuler/assets/41234227/4232d66c-5eb9-499a-888c-be5e61fe4c1d">
<img width="190" alt="스크린샷 2023-11-15 오후 11 37 14" src="https://github.com/ksa37/kezuler/assets/41234227/2e98c49a-d049-4a7c-973a-97fffd9c162a">
<img width="190" alt="스크린샷 2023-11-15 오후 11 42 02" src="https://github.com/ksa37/kezuler/assets/41234227/5f454455-6361-4bb9-bb07-03f97e6f3652">

- 카카오 로그인을 통해 로그인할 수 있고, 카카오 프로필 사진을 가져와 프로필로 반영
- 미팅 시간이 정해진 미팅(다가오는 미팅) /  미팅 시간이 정해지지 않은 미팅(투표중) 2가지 탭으로 구성
- 플러스 버튼을 눌러 호스트로서 미팅을 새로 생성할 수 있음

### 미팅 생성
<img width="199" alt="스크린샷 2023-11-16 오전 12 32 47" src="https://github.com/ksa37/kezuler/assets/41234227/2bfee3a8-d769-4e1d-ada7-88e833ab0d9b">
<img width="201" alt="스크린샷 2023-11-16 오전 12 33 19" src="https://github.com/ksa37/kezuler/assets/41234227/53fe7f6f-0432-4787-893b-8b5e756e7ac4">
<img width="193" alt="스크린샷 2023-11-16 오전 12 33 55" src="https://github.com/ksa37/kezuler/assets/41234227/b38fbc96-0d76-42c3-b163-18e9156a85a7">
<img width="194" alt="스크린샷 2023-11-16 오전 12 34 21" src="https://github.com/ksa37/kezuler/assets/41234227/9703260e-b1e0-49ee-8d50-e3cdca60cbc3">
<img width="193" alt="스크린샷 2023-11-16 오전 12 34 47" src="https://github.com/ksa37/kezuler/assets/41234227/07bad444-af8c-48a6-9d8b-260dabcc539a">

- 미팅에 대한 정보, 시간 선택지 입력, 장소 설정
- 시간 선택시 구글 캘린더를 연동하여 해당 날짜의 일정 확인 가능
- 미팅 생성 이후에는 카카오톡, 링크 등으로 미팅을 공유할 수 있음
- 이후 카카오톡으로 전송된 링크에서 미팅 참여자들이 시간 투표 가능

### 미팅 수락
<img width="214" alt="스크린샷 2023-11-16 오전 12 41 40" src="https://github.com/ksa37/kezuler/assets/41234227/6763047d-56ab-45bb-8e69-2039123447d6">
<img width="216" alt="스크린샷 2023-11-16 오전 12 42 07" src="https://github.com/ksa37/kezuler/assets/41234227/7190aba4-0d16-4823-b5e0-0894551af9be">
<img width="218" alt="스크린샷 2023-11-16 오전 12 43 03" src="https://github.com/ksa37/kezuler/assets/41234227/94558bd5-e63d-45c0-861c-eb988ba29498">
<img width="214" alt="스크린샷 2023-11-16 오전 12 43 27" src="https://github.com/ksa37/kezuler/assets/41234227/b9dfdaca-d5c0-4322-b664-d2eda9378332">
<img width="218" alt="스크린샷 2023-11-16 오전 12 43 41" src="https://github.com/ksa37/kezuler/assets/41234227/fba4fd95-7b7c-4f18-bf41-cafaeab0ba66">

- 케줄러 링크(미팅에 대한 링크)를 받은 사용자는 카카오톡으로 로그인하여 시간 선택 가능
- 구글 캘린더를 연동하여 해당 날짜에 있는 일정을 확인하며 선택하여 일정 중복 방지
