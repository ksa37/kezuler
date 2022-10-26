package com.kezuler.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kezuler.config.security.UserDetailsImpl;
import com.kezuler.domain.*;
import com.kezuler.dto.AccountDto;
import com.kezuler.dto.EventDto;
import com.kezuler.exception.CustomException;
import com.kezuler.exception.ExceptionCode;
import com.kezuler.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.boot.SpringApplicationRunListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final ParticipantsRepository participantsRepository;
    private final AlimtalkRepository alimtalkRepository;
    private final ObjectMapper objectMapper;
    private final MessageService messageService;
    private final EntityManager em;
    private final GoogleCalendarRepository googleCalendarRepository;
    private final GoogleEventRepository googleEventRepository;
    private final CalendarService calendarService;

    @Transactional
    public EventDto.GetPending createEvent(UserDetailsImpl userDetails, EventDto.Post eventDto) {

        Event event = Event.builder()
                .randomId(makeAccountIndex())
                .account(userDetails.getAccount())
                .title(eventDto.getEventTitle())
                .description(eventDto.getEventDescription())
                .duration(eventDto.getEventTimeDuration())
                .dates(datesToString(eventDto.getEventTimeCandidates()))
                .attachement(eventDto.getEventAttachment())
                .addressType(eventDto.getAddressType())
                .addressDetail(eventDto.getAddressDetail())
                .state("NONE")
                .confirmReminder(checkConfirmRemindDate(eventDto.getEventTimeCandidates()))
                .build();

        Event save = eventRepository.save(event);
        Account account = save.getAccount();

        Participants participants = Participants.builder()
                .account(account)
                .event(event)
                .role("HOST")
                .state("ACCEPT")
                .canceled(false)
                .deleted(false)
                .build();
        participantsRepository.save(participants);

        return getPendingDto(new ArrayList<>(), event);
    }

    private String makeAccountIndex() {
        while (true) {
            String resultCode = RandomStringUtils.randomAlphabetic(10);
            int count = eventRepository.countByRandomId(resultCode);
            if (count < 1) {
                return resultCode;
            }
        }
    }

    private String datesToString(List<Long> eventTimeCandidates) {
        Map<Long, Integer> map = new HashMap<>();
        for (Long time : eventTimeCandidates) {
            map.put(time, 0);
        }
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            throw new CustomException(ExceptionCode.UNABLE_TO_MAKE_EVENT.getCode(), ExceptionCode.UNABLE_TO_MAKE_EVENT.getMessage());
        }
    }

    private LocalDateTime checkConfirmRemindDate(List<Long> eventTimeCandidates) {
        Long[] timeArr = eventTimeCandidates.toArray(new Long[eventTimeCandidates.size()]);
        Arrays.sort(timeArr);
        Long time = timeArr[0];
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(time), TimeZone.getDefault().toZoneId()).minusHours(36);
    }

    @Transactional
    public EventDto.GetPending updatePendingEvent(UserDetailsImpl userDetails, EventDto.Update eventDto) {
        Event event = eventRepository.findByRandomIdAndAccount(eventDto.getEventId(), userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));
        if (event.getState().equals("NONE")) {
            event.updateEvent(eventDto);
        } else {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }
        List<Participants> participants = participantsRepository.findByEvent(event);
        return getPendingDto(participants, event);
    }

    @Transactional
    public EventDto.GetPending cancelPendingEventByHost(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomIdAndAccount(randomId, userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));
        if (!event.getState().equals("NONE")) {
            throw new CustomException(ExceptionCode.INVALID_ACCESS_EVENT.getCode(), ExceptionCode.INVALID_ACCESS_EVENT.getMessage());
        }
        Participants host = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));


        host.updateStateToCancel();
        event.cancelEvent();
        // 알림톡 발송 준비
        Map<String, String> replace = new HashMap<>();
        replace.put("meetingName", event.getTitle());
        replace.put("eventId", event.getRandomId());

        List<Participants> participants = participantsRepository.findByEvent(event);
        for (Participants participant : participants) {
            participant.setRemindDate(null);
            // 알림톡 발송
            if (participant.getRole().equals("GUEST")) {
                messageService.sendAlimtalk(participant.getAccount(), "canguest", replace);
            }
        }
        messageService.sendAlimtalk(userDetails.getAccount(), "canhost", replace);


        return getPendingDto(participants, event);
    }

    @Transactional
    public void deletePendingEventByHost(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomIdAndAccount(randomId, userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));

        if (event.getState().equals("CANCEL") || event.getState().equals("DISABLE")) {
            Participants participants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                    .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_PARTICIPANTS.getCode(),
                            ExceptionCode.NOT_FOUND_PARTICIPANTS.getMessage()));
            if (!participants.isDeleted()) {
                participants.updateStateToDelete();
            }
        } else {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }
    }


    @Transactional
    public void cancelPendingEventByGuest(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));

        Participants participants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_PARTICIPANTS.getCode(),
                        ExceptionCode.NOT_FOUND_PARTICIPANTS.getMessage()));
        try {
            if (participants.getState().equals("ACCEPT")) {
                List<Long> stateInfo = objectMapper.readValue(participants.getStateInfo(), new TypeReference<List<Long>>() {
                });
                Map<Long, Integer> dates = objectMapper.readValue(event.getDates(), new TypeReference<Map<Long, Integer>>() {
                });
                for (Long date : stateInfo) {
                    Integer count = dates.get(date);
                    dates.put(date, --count);
                }
                event.updateCandidateTime(objectMapper.writeValueAsString(dates));
                // 이전 투표를 미팅일정에서 - 해준 뒤 새로 들어온 투표를 ++ 해주고 결과를 저장해줌
            }
            if (!participants.isDeleted()) {
                participants.updateStateToDelete();
                participants.updateStateToCancel();
            }
        } catch (Exception e) {
            throw new CustomException(ExceptionCode.NO_INVITATION_EVENT.getCode(), ExceptionCode.NO_INVITATION_EVENT.getMessage());
        }
    }

    @Transactional
    public void deleteEventByGuest(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));

        if (event.getState().equals("DISABLE")) {
            Participants participants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                    .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_PARTICIPANTS.getCode(),
                            ExceptionCode.NOT_FOUND_PARTICIPANTS.getMessage()));
            if (participants.isCanceled()) {
                participants.updateStateToDelete();
            }
        } else {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }
    }


    @Transactional
    public EventDto.GetPending invitedGuestAccept(UserDetailsImpl userDetails, String randomId, List<Long> addTimeCandidates) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));
        // 채팅방 상태가 NONE(초기 생성에 투표중인 상황) 일때만 신규 게스트 초대가능
        if (!event.getState().equals("NONE")) {
            throw new CustomException(ExceptionCode.NO_INVITATION_EVENT.getCode(), ExceptionCode.NO_INVITATION_EVENT.getMessage());
        }
        // 호스트가 들어오면 예외 발생
        if (event.getAccount().getId().equals(userDetails.getAccount().getId())) {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }

        Optional<Participants> optParticipants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event);
        try {
            // 이미 미팅에 추가되어 있었고 투표 시간만 바꾸는 경우
            if (optParticipants.isPresent()) {
                Participants participants = optParticipants.get();
                Map<Long, Integer> dates = objectMapper.readValue(event.getDates(), new TypeReference<Map<Long, Integer>>() {
                });
                if (participants.getState().equals("ACCEPT")) {
                    List<Long> stateInfo = objectMapper.readValue(participants.getStateInfo(), new TypeReference<List<Long>>() {
                    });
                    for (Long date : stateInfo) {
                        Integer count = dates.get(date);
                        dates.put(date, --count);
                    }
                    // 이전 투표를 미팅일정에서 - 해준 뒤 새로 들어온 투표를 ++ 해주고 결과를 저장해줌
                }
                for (Long date : addTimeCandidates) {
                    Integer count = dates.get(date);
                    dates.put(date, ++count);
                }
                event.updateCandidateTime(objectMapper.writeValueAsString(dates));
                participants.updateVotingStatusAccept(objectMapper.writeValueAsString(addTimeCandidates));
                // 미팅에 신규 추가 됨
            } else {
                Map<Long, Integer> dates = objectMapper.readValue(event.getDates(), new TypeReference<Map<Long, Integer>>() {
                });
                for (Long date : addTimeCandidates) {
                    Integer count = dates.get(date);
                    dates.put(date, ++count);
                }
                event.updateCandidateTime(objectMapper.writeValueAsString(dates));

                Participants participants = Participants.builder()
                        .account(userDetails.getAccount())
                        .event(event)
                        .role("GUEST")
                        .state("ACCEPT")
                        .stateInfo(objectMapper.writeValueAsString(addTimeCandidates))
                        .canceled(false)
                        .deleted(false)
                        .build();
                participantsRepository.save(participants);

            }

        } catch (Exception e) {
            throw new CustomException(ExceptionCode.NO_INVITATION_EVENT.getCode(), ExceptionCode.NO_INVITATION_EVENT.getMessage());
        }


        List<Alimtalk> alimtalkList = alimtalkRepository.getAbleToSendParticipants(userDetails.getAccount().getId(), event.getRandomId());
        if (alimtalkList.size() == 0) {
            // 알림톡 발송 준비
            Map<String, String> replace = new HashMap<>();
            replace.put("meetingName", event.getTitle());
            replace.put("eventId", event.getRandomId());
            replace.put("userName", userDetails.getAccount().getName());

            // 알림톡 발송
            messageService.sendAlimtalk(event.getAccount(), "newguest4", replace);
        }

        List<Participants> participants = participantsRepository.findByEvent(event);
        return getPendingDto(participants, event);

    }

    @Transactional
    public EventDto.GetPending invitedGuestDecline(UserDetailsImpl userDetails, String randomId, EventDto.DeclineReason eventDto) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));
        // 채팅방 상태가 NONE(초기 생성에 투표중인 상황) 일때만 신규 게스트 초대가능
        if (!event.getState().equals("NONE")) {
            throw new CustomException(ExceptionCode.NO_INVITATION_EVENT.getCode(), ExceptionCode.NO_INVITATION_EVENT.getMessage());
        }
        // 호스트가 들어오면 예외 발생
        if (event.getAccount().getId().equals(userDetails.getAccount().getId())) {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }
        Optional<Participants> optParticipants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event);

        try {
            if (optParticipants.isPresent()) {
                Participants participants = optParticipants.get();
                if (participants.getState().equals("ACCEPT")) {
                    List<Long> stateInfo = objectMapper.readValue(participants.getStateInfo(), new TypeReference<List<Long>>() {
                    });
                    Map<Long, Integer> dates = objectMapper.readValue(event.getDates(), new TypeReference<Map<Long, Integer>>() {
                    });
                    for (Long date : stateInfo) {
                        Integer count = dates.get(date);
                        dates.put(date, --count);
                    }
                    event.updateCandidateTime(objectMapper.writeValueAsString(dates));
                    // 이전 투표를 미팅일정에서 - 해준 뒤 새로 들어온 투표를 ++ 해주고 결과를 저장해줌
                }
                log.info(" Enter -> [ PendingController @Delete /pendingEvents/{eventId}/candidate ] ::: {}", eventDto.getUserDeclineReason());
                participants.updateVotingStatusDecline(eventDto.getUserDeclineReason());
            } else {
                Participants participants = Participants.builder()
                        .account(userDetails.getAccount())
                        .event(event)
                        .role("GUEST")
                        .state("UNDEFINE")
                        .stateInfo(eventDto.getUserDeclineReason())
                        .canceled(false)
                        .deleted(false)
                        .build();
                participantsRepository.save(participants);
            }

        } catch (Exception e) {
            throw new CustomException(ExceptionCode.NO_INVITATION_EVENT.getCode(), ExceptionCode.NO_INVITATION_EVENT.getMessage());
        }

        List<Alimtalk> alimtalkList = alimtalkRepository.getAbleToSendParticipants(userDetails.getAccount().getId(), event.getRandomId());
        if (alimtalkList.size() == 0) {
            // 알림톡 발송 준비
            Map<String, String> replace = new HashMap<>();
            replace.put("meetingName", event.getTitle());
            replace.put("eventId", event.getRandomId());
            replace.put("userName", userDetails.getAccount().getName());

            // 알림톡 발송
            messageService.sendAlimtalk(event.getAccount(), "newguest4", replace);
        }

        List<Participants> participants = participantsRepository.findByEvent(event);
        return getPendingDto(participants, event);
    }

    public void checkPermission(UserDetailsImpl userDetails, Event event) {
        int count = participantsRepository.countByAccountAndEvent(userDetails.getAccount(), event);
        if (count < 1) {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }
    }

    public EventDto.GetPending getPending(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));

        checkPermission(userDetails, event);

        if (!event.getState().equals("NONE") && !event.getState().equals("CANCEL")) {
            throw new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(), ExceptionCode.NOT_FOUND_EVENT.getMessage());
        }

        List<Participants> participants = participantsRepository.findByEvent(event);
        return getPendingDto(participants, event);
    }

    public List<EventDto.GetPending> getPendings(UserDetailsImpl userDetails, PageRequest pageable) {
        List<EventDto.GetPending> result = new ArrayList<>();
        // 계정이 속한 event 가져온 뒤
        Page<Participants> participants = participantsRepository.getPendingEvents(userDetails.getAccount().getId(), pageable);
        for (Participants participant : participants.getContent()) {
            List<Participants> byEvent = participantsRepository.findByEvent(participant.getEvent());
            result.add(getPendingDto(byEvent, participant.getEvent()));
        }
        return result;
    }

    public EventDto.GetPending getInvitationEvent(String eventId) {
        Event event = eventRepository.findByRandomId(eventId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));
        // 채팅방 상태가 NONE(초기 생성에 투표중인 상황) 일때만 신규 게스트 초대가능
        if (!event.getState().equals("NONE")) {
            throw new CustomException(ExceptionCode.NO_INVITATION_EVENT.getCode(), ExceptionCode.NO_INVITATION_EVENT.getMessage());
        }
        List<Participants> participants = participantsRepository.findByEvent(event);
        return getPendingDto(participants, event);
    }


    public EventDto.GetPending getPendingDto(List<Participants> participants, Event event) {

        try {
            Account host = event.getAccount();

            EventDto.GetPending getPending = EventDto.GetPending.builder()
                    .eventId(event.getRandomId())
                    .eventHost(AccountDto.GetHost.builder().userId(host.getRandomId()).userName(host.getName()).userProfileImage(host.getProfileImage()).build())
                    .eventTitle(event.getTitle())
                    .eventDescription(event.getDescription())
                    .eventTimeDuration(event.getDuration())
                    .declinedUsers(new ArrayList<>())
                    .eventTimeCandidates(new ArrayList<>())
                    .addressType(event.getAddressType())
                    .addressDetail(event.getAddressDetail())
                    .eventAttachment(event.getAttachement())
                    .disable(event.getState().equals("CANCEL"))
                    .state(event.getState())
                    .build();


            Map<Long, Integer> dates = objectMapper.readValue(event.getDates(), new TypeReference<Map<Long, Integer>>() {
            });

            List<Long> keyList = new ArrayList<>(dates.keySet());
            keyList.sort((s1, s2) -> s1.compareTo(s2));

            List<AccountDto.GetCandidates> eventTimeCandidates = new ArrayList<>();

            for (Long date : keyList) {
                AccountDto.GetCandidates startsAt = AccountDto.GetCandidates.builder()
                        .eventStartsAt(date)
                        .possibleUsers(new ArrayList<>())
                        .build();
                eventTimeCandidates.add(startsAt);
            }

            List<AccountDto.GetDecliner> declinedUsers = new ArrayList<>();

            for (Participants participant : participants) {
                if (participant.getRole().equals("GUEST")) {

                    if (participant.getState().equals("ACCEPT")) {
                        List<Long> stateInfo = objectMapper.readValue(participant.getStateInfo(), new TypeReference<List<Long>>() {
                        });
                        for (Long date : stateInfo) {
                            for (AccountDto.GetCandidates candidates : eventTimeCandidates) {
                                if (candidates.getEventStartsAt().equals(date)) {
                                    candidates.getPossibleUsers().add(
                                            AccountDto.GetHost.builder()
                                                    .userId(participant.getAccount().getRandomId())
                                                    .userName(participant.getAccount().getName())
                                                    .userProfileImage(participant.getAccount().getProfileImage())
                                                    .canceled(participant.isCanceled())
                                                    .build());
                                    break;
                                }
                            }

                        }
                    } else if (participant.getState().equals("UNDEFINE")) {
                        declinedUsers.add(AccountDto.GetDecliner.builder()
                                .userId(participant.getAccount().getRandomId())
                                .userName(participant.getAccount().getName())
                                .userProfileImage(participant.getAccount().getProfileImage())
                                .userDeclineReason(participant.getStateInfo())
                                .canceled(participant.isCanceled())
                                .build());
                    }
                }
            }
            getPending.setEventTimeCandidates(eventTimeCandidates);
            getPending.setDeclinedUsers(declinedUsers);
            return getPending;
        } catch (Exception e) {
            log.info("{}", e.getMessage());
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }
    }

    // ::::::::::::::::::::::::::::::: fixed 관련 :::::::::::::::::::::::::::::::
    @Transactional
    public EventDto.GetFixed confirmByHost(UserDetailsImpl userDetails, EventDto.Fixed eventDto) {
        Event event = eventRepository.findByRandomIdAndAccount(eventDto.getPendingEventId(), userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));

        if (!event.getState().equals("NONE")) {
            throw new CustomException(ExceptionCode.INVALID_ACCESS_EVENT.getCode(), ExceptionCode.INVALID_ACCESS_EVENT.getMessage());
        }

        // event 상태 변경
        LocalDateTime acceptTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(eventDto.getEventTimeStartsAt()), TimeZone.getDefault().toZoneId());
        event.confirmEvent(acceptTime);


        // participants 회원별 리마인더 시간 설정
        List<Participants> participants = participantsRepository.getPossibleActive(event.getId());
        for (Participants participant : participants) {
            participant.updateState("ACTIVE");
            participant.setRemindDate(acceptTime.minusDays(1));
            // 알림톡 발송 준비
            Map<String, String> replace = new HashMap<>();
            replace.put("meetingName", event.getTitle());
            replace.put("meetingTime", formatTime(participant.getEvent(), participant.getAccount().getTimezone()));
            replace.put("meetingPlace", event.getAddressDetail().equals("") ? "온라인" : event.getAddressDetail());
            replace.put("timeZone", participant.getAccount().getTimezone());
            replace.put("eventId", event.getRandomId());

            // 알림톡 발송
            if (participant.getRole().equals("GUEST")) {
                messageService.sendAlimtalk(participant.getAccount(), "conguest", replace);
            } else {
                messageService.sendAlimtalk(participant.getAccount(), "conhost", replace);
            }
        }

        return getFixedDto(participants, event);
    }

    @Transactional
    public EventDto.GetFixed updateFixedEvent(UserDetailsImpl userDetails, EventDto.Update eventDto) {
        Event event = eventRepository.findByRandomIdAndAccount(eventDto.getEventId(), userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));

        if (event.getState().equals("ACTIVE")) {
            event.updateEvent(eventDto);
        } else {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }

        List<Participants> participants = participantsRepository.findByEvent(event);
        return getFixedDto(participants, event);
    }

    @Transactional
    public EventDto.GetFixed cancelFixedEventByGuest(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));

        Participants participants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_PARTICIPANTS.getCode(),
                        ExceptionCode.NOT_FOUND_PARTICIPANTS.getMessage()));
        if (participants.getState().equals("ACTIVE") && !participants.isCanceled() && !participants.isDeleted()) {
            participants.updateStateToCancel();
            participants.setRemindDate(null);
        } else {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }

        if (userDetails.getAccount().isGoogleCalendarToggle()) {
            Optional<GoogleCalendar> optGoogleCalendar = calendarService.renewalAccessToken(userDetails.getAccount());
            if (optGoogleCalendar.isPresent()) {
                GoogleCalendar googleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount())
                        .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getCode(),
                                ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getMessage()));

                Optional<GoogleEvent> optGoogleEvent = googleEventRepository.findByAccountAndEvent(userDetails.getAccount(), event);

                if (optGoogleEvent.isPresent()) {
                    GoogleEvent googleEvent = optGoogleEvent.get();
                    JSONObject resultObject = calendarService.deleteEvent(googleCalendar, googleEvent);
                    log.info("resultObject: {}", resultObject);
                    if (resultObject == null) {
                        googleEventRepository.deleteById(googleEvent.getId());
                    }
                }
            }
        }

        List<Participants> participantsList = participantsRepository.findByEvent(event);
        return getFixedDto(participantsList, event);
    }

    @Transactional
    public EventDto.GetFixed reattendFixedEventByGuest(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));

        Participants participants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_PARTICIPANTS.getCode(),
                        ExceptionCode.NOT_FOUND_PARTICIPANTS.getMessage()));

        if (participants.getState().equals("ACTIVE") && participants.isCanceled() && !participants.isDeleted()) {
            participants.updateStateToReAttend();
            participants.setRemindDate(event.getConfirmedAt().minusDays(1));
        } else {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }


        List<Participants> participantsList = participantsRepository.findByEvent(event);
        return getFixedDto(participantsList, event);

    }

    @Transactional
    public EventDto.GetFixed deleteFixedEventByGuest(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));

        Participants participants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_PARTICIPANTS.getCode(),
                        ExceptionCode.NOT_FOUND_PARTICIPANTS.getMessage()));

        if (participants.isCanceled() || event.getState().equals("DISABLE") || event.getState().equals("ACTIVECANCEL")) {
            participants.updateStateToDelete();
        } else {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }

        List<Participants> participantsList = participantsRepository.findByEvent(event);
        return getFixedDto(participantsList, event);
    }

    @Transactional
    public EventDto.GetFixed cancelFixedEventByHost(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomIdAndAccount(randomId, userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));

        if (!event.getState().equals("ACTIVE")) {
            throw new CustomException(ExceptionCode.INVALID_ACCESS_EVENT.getCode(), ExceptionCode.INVALID_ACCESS_EVENT.getMessage());
        }

        Participants host = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));

        event.cancelFixedEvent();
        host.updateStateToCancel();

        // 알림톡 발송 준비
        Map<String, String> replace = new HashMap<>();
        replace.put("meetingName", event.getTitle());
        replace.put("eventId", event.getRandomId());

        List<Participants> participants = participantsRepository.findByEvent(event);
        for (Participants participant : participants) {
            participant.setRemindDate(null);
            // 알림톡 발송
            if (participant.getRole().equals("GUEST")) {
                messageService.sendAlimtalk(participant.getAccount(), "canguest", replace);
            }
        }

        messageService.sendAlimtalk(userDetails.getAccount(), "canhost", replace);


        // 구글 해당 event 취소 처리
        // 모든 참여원 구글 토큰 갱신 후 전송
//        for (Participants participant : participants) {
//            Account account = participant.getAccount();
//            if (account.isGoogleCalendarToggle()) {
//                calendarService.renewalAccessToken(participant.getAccount());
//            }
//        }
//        for (Participants participant : participants) {
//            Account account = participant.getAccount();
//            if (account.isGoogleCalendarToggle()) {
//
//            }
//        }


        return getFixedDto(participants, event);
    }

    @Transactional
    public void deleteFixedEventByHost(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomIdAndAccount(randomId, userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));

        Participants participants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_PARTICIPANTS.getCode(),
                        ExceptionCode.NOT_FOUND_PARTICIPANTS.getMessage()));

        if ((event.getState().equals("ACTIVECANCEL") && participants.isCanceled()) || event.getState().equals("DISABLE")) {
            participants.updateStateToDelete();
        } else {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }
    }

    public EventDto.GetFixed getFixed(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));
        checkPermission(userDetails, event);

        if (event.getState().equals("NONE") || event.getState().equals("CANCEL")) {
            throw new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(), ExceptionCode.NOT_FOUND_EVENT.getMessage());
        }

        List<Participants> participants = participantsRepository.findByEvent(event);

        return getFixedDto(participants, event);
    }

//    public List<EventDto.GetFixed> getFixeds(UserDetailsImpl userDetails, PageRequest pageable) {
//        List<EventDto.GetFixed> result = new ArrayList<>();
//        // 계정이 속한 event 가져온 뒤
//        Page<Participants> participants = participantsRepository.getFixedEvents(userDetails.getAccount().getId(), pageable);
//        for (Participants participant : participants.getContent()) {
//            List<Participants> byEvent = participantsRepository.findByEventAndState(participant.getEvent(), "ACTIVE");
//            result.add(getFixedDto(byEvent, participant.getEvent()));
//        }
//        return result;
//    }

    /*
     * AS-IS -미팅 시작 시각 기준 시간 순 정렬
     * TO-BE
     * get fixedEvents할때 pagination과 관련해서 질문이 있는데요,
     * 이게 화면에 처음 보여주는게 최근 날짜에 관련된걸 보여줘야 해서요,
     * 처음에는 최신날짜에 관련된 15개를 갖고 오고,
     * 아래로 스크롤 하면 더 나중의 미팅, 위로 스크롤 하면 지나간 미팅이 나오도록
     * */

    public List<EventDto.GetFixed> getFixeds(UserDetailsImpl userDetails, int page) {

        List<Participants> resultList = new ArrayList<>();

        if (page < 0) {
            page = Math.abs(page);

            System.out.println(">>> " + page);
            String selectTarget = "new com.kezuler.domain.Participants (p.id, p.account, p.event, p.role, p.state, p.stateInfo, p.canceled, p.deleted, p.remindDate )";
            String query = " SELECT " + selectTarget;
            query += " FROM Participants p";
            query += " WHERE p.account = :id";
            query += " AND p.event.state NOT IN ('NONE', 'CANCEL')";
            query += " AND p.state = 'ACTIVE'";
            query += " AND p.deleted = false";
            query += " ORDER BY ABS(TIME_TO_SEC(TIMEDIFF(p.event.confirmedAt, CURRENT_TIMESTAMP)))";
            List<Participants> participantsList = em.createQuery(query, Participants.class)
                    .setParameter("id", userDetails.getAccount())
                    .setMaxResults(1)
                    .getResultList();
            if (!participantsList.isEmpty()) {
                Participants nearOne = participantsList.get(0);
                System.out.println("::::::::::::::::: nearOne : " + nearOne.getId());

                String preQuery = " SELECT " + selectTarget;
                preQuery += " FROM Participants p";
                preQuery += " WHERE p.account = :id";
                preQuery += " AND p.event.state NOT IN ('NONE', 'CANCEL')";
                preQuery += " AND p.state = 'ACTIVE'";
                preQuery += " AND p.deleted = false";
                preQuery += " AND p.event.confirmedAt < :near";
                preQuery += " ORDER BY p.event.confirmedAt DESC";
                List<Participants> preList = em.createQuery(preQuery, Participants.class)
                        .setParameter("id", userDetails.getAccount())
                        .setParameter("near", nearOne.getEvent().getConfirmedAt())
                        .setMaxResults(7 + (page * 15))
                        .getResultList();
                System.out.println("::::::::::::::::: preList " + preList.size());

                Collections.reverse(preList);
                for (int i = 0; i < preList.size() - (7 + ((page - 1) * 15)); i++) {
                    resultList.add(preList.get(i));
                }
            }
        } else if (page > 0) {
            page = Math.abs(page);

            System.out.println(">>> " + page);
            String selectTarget = "new com.kezuler.domain.Participants (p.id, p.account, p.event, p.role, p.state, p.stateInfo, p.canceled, p.deleted, p.remindDate )";
            String query = " SELECT " + selectTarget;
            query += " FROM Participants p";
            query += " WHERE p.account = :id";
            query += " AND p.event.state NOT IN ('NONE', 'CANCEL')";
            query += " AND p.state = 'ACTIVE'";
            query += " AND p.deleted = false";
            query += " ORDER BY ABS(TIME_TO_SEC(TIMEDIFF(p.event.confirmedAt, CURRENT_TIMESTAMP)))";
            List<Participants> participantsList = em.createQuery(query, Participants.class)
                    .setParameter("id", userDetails.getAccount())
                    .setMaxResults(1)
                    .getResultList();
            if (!participantsList.isEmpty()) {
                Participants nearOne = participantsList.get(0);
                System.out.println("::::::::::::::::: nearOne : " + nearOne.getId());

                String postQuery = " SELECT " + selectTarget;
                postQuery += " FROM Participants p";
                postQuery += " WHERE p.account = :id";
                postQuery += " AND p.event.state NOT IN ('NONE', 'CANCEL')";
                postQuery += " AND p.state = 'ACTIVE'";
                postQuery += " AND p.deleted = false";
                postQuery += " AND p.event.confirmedAt >= :near";
                postQuery += " ORDER BY TIME_TO_SEC(TIMEDIFF(p.event.confirmedAt, :near)) ASC";
                List<Participants> postList = em.createQuery(postQuery, Participants.class)
                        .setParameter("id", userDetails.getAccount())
                        .setParameter("near", nearOne.getEvent().getConfirmedAt())
                        .setMaxResults(8 + (page * 15))
                        .getResultList();
                System.out.println("::::::::::::::::: postList " + postList.size());

                for (int i = (8 + ((page - 1) * 15)); i < postList.size(); i++) {
                    if (!postList.get(i).getId().equals(nearOne.getId())) {
                        resultList.add(postList.get(i));
                    }
                }
            }
        } else {
            // 오늘에 가장 가까운 일정 가져옴
            // 그 일정 기준 이전 7개
            // 그 일정 기준 이후 7개
            // page -1 일 경우 그 일정 기준 22개
            String selectTarget = "new com.kezuler.domain.Participants (p.id, p.account, p.event, p.role, p.state, p.stateInfo, p.canceled, p.deleted, p.remindDate )";
            String query = " SELECT " + selectTarget;
            query += " FROM Participants p";
            query += " WHERE p.account = :id";
            query += " AND p.event.state NOT IN ('NONE', 'CANCEL')";
            query += " AND p.state = 'ACTIVE'";
            query += " AND p.deleted = false";
            query += " ORDER BY ABS(TIME_TO_SEC(TIMEDIFF(p.event.confirmedAt, CURRENT_TIMESTAMP)))";
            List<Participants> participantsList = em.createQuery(query, Participants.class)
                    .setParameter("id", userDetails.getAccount())
                    .setMaxResults(1)
                    .getResultList();
            if (!participantsList.isEmpty()) {
                Participants nearOne = participantsList.get(0);
                System.out.println("::::::::::::::::: nearOne : " + nearOne.getId());

                String preQuery = " SELECT " + selectTarget;
                preQuery += " FROM Participants p";
                preQuery += " WHERE p.account = :id";
                preQuery += " AND p.event.state NOT IN ('NONE', 'CANCEL')";
                preQuery += " AND p.state = 'ACTIVE'";
                preQuery += " AND p.deleted = false";
                preQuery += " AND p.event.confirmedAt < :near";
                preQuery += " ORDER BY p.event.confirmedAt DESC";
                List<Participants> preList = em.createQuery(preQuery, Participants.class)
                        .setParameter("id", userDetails.getAccount())
                        .setParameter("near", nearOne.getEvent().getConfirmedAt())
                        .setMaxResults(7)
                        .getResultList();
                System.out.println("::::::::::::::::: preList " + preList.size());

                Collections.reverse(preList);
                for (Participants participants : preList) {
                    resultList.add(participants);
                }

                resultList.add(nearOne);

                String postQuery = " SELECT " + selectTarget;
                postQuery += " FROM Participants p";
                postQuery += " WHERE p.account = :id";
                postQuery += " AND p.event.state NOT IN ('NONE', 'CANCEL')";
                postQuery += " AND p.state = 'ACTIVE'";
                postQuery += " AND p.deleted = false";
                postQuery += " AND p.event.confirmedAt >= :near";
                postQuery += " ORDER BY TIME_TO_SEC(TIMEDIFF(p.event.confirmedAt, :near)) ASC";
                List<Participants> postList = em.createQuery(postQuery, Participants.class)
                        .setParameter("id", userDetails.getAccount())
                        .setParameter("near", nearOne.getEvent().getConfirmedAt())
                        .setMaxResults(8)
                        .getResultList();
                System.out.println("::::::::::::::::: postList " + postList.size());

                for (int i = 0; i < postList.size(); i++) {
                    if (!postList.get(i).getId().equals(nearOne.getId())) {
                        resultList.add(postList.get(i));
                    }
                }
            }
        }

        System.out.println("::::::::::::::::: resultList " + resultList.size());


        List<EventDto.GetFixed> result = new ArrayList<>();
        for (Participants participant : resultList) {
            List<Participants> byEvent = participantsRepository.findByEvent(participant.getEvent());
            result.add(getFixedDto(byEvent, participant.getEvent()));
        }

        return result;
    }

    public int getFixedsNextCount(UserDetailsImpl userDetails, int page) {

        page += 1;
        int result = 0;

        List<Participants> resultList = new ArrayList<>();

        if (page < 0) {

        } else if (page > 0) {

            String selectTarget = "new com.kezuler.domain.Participants (p.id, p.account, p.event, p.role, p.state, p.stateInfo, p.canceled, p.deleted, p.remindDate )";
            String query = " SELECT " + selectTarget;
            query += " FROM Participants p";
            query += " WHERE p.account = :id";
            query += " AND p.event.state NOT IN ('NONE', 'CANCEL')";
            query += " AND p.state = 'ACTIVE'";
            query += " AND p.deleted = false";
            query += " ORDER BY ABS(TIME_TO_SEC(TIMEDIFF(p.event.confirmedAt, CURRENT_TIMESTAMP)))";
            List<Participants> participantsList = em.createQuery(query, Participants.class)
                    .setParameter("id", userDetails.getAccount())
                    .setMaxResults(1)
                    .getResultList();
            if (!participantsList.isEmpty()) {
                Participants nearOne = participantsList.get(0);
                System.out.println("::::::::::::::::: nearOne : " + nearOne.getId());

                String postQuery = " SELECT " + selectTarget;
                postQuery += " FROM Participants p";
                postQuery += " WHERE p.account = :id";
                postQuery += " AND p.event.state NOT IN ('NONE', 'CANCEL')";
                postQuery += " AND p.state = 'ACTIVE'";
                postQuery += " AND p.deleted = false";
                postQuery += " AND p.event.confirmedAt >= :near";
                postQuery += " ORDER BY TIME_TO_SEC(TIMEDIFF(p.event.confirmedAt, :near)) ASC";
                List<Participants> postList = em.createQuery(postQuery, Participants.class)
                        .setParameter("id", userDetails.getAccount())
                        .setParameter("near", nearOne.getEvent().getConfirmedAt())
                        .setMaxResults(8 + (page * 15))
                        .getResultList();
                System.out.println("::::::::::::::::: postList " + postList.size());
                for (int i = (8 + ((page - 1) * 15)); i < postList.size(); i++) {
                    if (!postList.get(i).getId().equals(nearOne.getId())) {
                        resultList.add(postList.get(i));
                    }
                }
                result = postList.size() - (8 + ((page - 1) * 15));
                if (result < 0) {
                    result = 0;
                }
            }
        } else {

        }
        return result;
    }

    public EventDto.GetFixed getFixedDto(List<Participants> participants, Event event) {

        Account host = event.getAccount();

        EventDto.GetFixed getFixed = EventDto.GetFixed.builder()
                .eventId(event.getRandomId())
                .eventHost(AccountDto.GetFixedAccount.builder().userId(host.getRandomId()).userName(host.getName()).userProfileImage(host.getProfileImage()).userStatus((event.getState().equals("CANCEL") ? "Declined" : "Accepted")).build())
                .eventTitle(event.getTitle())
                .eventDescription(event.getDescription())
                .eventTimeDuration(event.getDuration())
                .eventTimeStartsAt(event.getConfirmedAt() != null ? Timestamp.valueOf(event.getConfirmedAt()).getTime() : null)
                .participants(new ArrayList<>())
                .addressType(event.getAddressType())
                .addressDetail(event.getAddressDetail())
                .disable(event.getState().equals("ACTIVECANCEL"))
                .state(event.getState())
                .build();

        List<AccountDto.GetFixedAccount> eventParticipants = new ArrayList<>();

        for (Participants participant : participants) {
            if (participant.getRole().equals("GUEST")) {
                if (participant.isDeleted()) {
                    AccountDto.GetFixedAccount declined = AccountDto.GetFixedAccount.builder()
                            .userId(participant.getAccount().getRandomId())
                            .userName(participant.getAccount().getName())
                            .userProfileImage(participant.getAccount().getProfileImage())
                            .userStatus("Deleted")
                            .build();
                    eventParticipants.add(declined);
                } else if (participant.isCanceled()) {
                    AccountDto.GetFixedAccount declined = AccountDto.GetFixedAccount.builder()
                            .userId(participant.getAccount().getRandomId())
                            .userName(participant.getAccount().getName())
                            .userProfileImage(participant.getAccount().getProfileImage())
                            .userStatus("Declined")
                            .build();
                    eventParticipants.add(declined);
                } else {
                    AccountDto.GetFixedAccount declined = AccountDto.GetFixedAccount.builder()
                            .userId(participant.getAccount().getRandomId())
                            .userName(participant.getAccount().getName())
                            .userProfileImage(participant.getAccount().getProfileImage())
                            .userStatus("Accepted")
                            .build();
                    eventParticipants.add(declined);
                }
            }
        }
        getFixed.setParticipants(eventParticipants);
        return getFixed;

    }

    @Transactional
    public void updateReminder(UserDetailsImpl userDetails, String randomId, EventDto.Reminder eventDto) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));

        if (!event.getState().equals("ACTIVE")) {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }
        Participants participants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_PARTICIPANTS.getCode(),
                        ExceptionCode.NOT_FOUND_PARTICIPANTS.getMessage()));

        System.out.println(eventDto.getRemindDate());
        LocalDateTime confirmedAt = event.getConfirmedAt();

        switch (eventDto.getRemindDate()) {
            case 1:
                confirmedAt = confirmedAt.minusHours(1);
                break;
            case 24:
                confirmedAt = confirmedAt.minusDays(1);
                break;
            case 168:
                confirmedAt = confirmedAt.minusDays(7);
                break;
            default:
                confirmedAt = null;
        }
        participants.setRemindDate(confirmedAt);

    }

    @Transactional
    public long getReminder(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(),
                        ExceptionCode.NO_PERMISSION_EVENT.getMessage()));

        if (!event.getState().equals("ACTIVE")) {
            throw new CustomException(ExceptionCode.NO_PERMISSION_EVENT.getCode(), ExceptionCode.NO_PERMISSION_EVENT.getMessage());
        }
        Participants participants = participantsRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_PARTICIPANTS.getCode(),
                        ExceptionCode.NOT_FOUND_PARTICIPANTS.getMessage()));

        if (participants.getRemindDate() == null) {
            return 0L;
        } else {
            long eventTime = Timestamp.valueOf(event.getConfirmedAt()).getTime();
            long personalTime = Timestamp.valueOf(participants.getRemindDate()).getTime();
            return TimeUnit.MILLISECONDS.toHours(eventTime - personalTime);
        }
    }

    private String formatTime(Event event, String timezone) {
        String result = LocalDateTime.ofInstant(Instant.ofEpochMilli(Timestamp.valueOf(event.getConfirmedAt()).getTime()), ZoneId.of(timezone)).format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 a hh:mm ~").withLocale(Locale.forLanguageTag("ko")));
        result += LocalDateTime.ofInstant(Instant.ofEpochMilli(Timestamp.valueOf(event.getConfirmedAt().plusMinutes(Long.parseLong(event.getDuration()))).getTime()), ZoneId.of(timezone)).format(DateTimeFormatter.ofPattern(" a hh:mm").withLocale(Locale.forLanguageTag("ko")));
        return result;
    }
}
