package com.kezuler.service;

import com.kezuler.domain.Event;
import com.kezuler.domain.Participants;
import com.kezuler.repository.EventRepository;
import com.kezuler.repository.ParticipantsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final EventRepository eventRepository;
    private final ParticipantsRepository participantsRepository;
    private final MessageService messageService;

//        @Scheduled(cron = "0/30 * * * * *")    // 테스트 : 30초마다 실행
    @Scheduled(cron = "0 0/30 * * * *")    // 업로드  : 매시간 0분, 30분 마다 실행
    @Transactional
    public void reminderHost() {
        log.info(" Enter -> [ ScheduleService reminder participants, confirm to host ] ");

        // 최초시간 36시간 전 일정을 확정지으라고 호스트에게 보내는 리마인더
        List<Event> events = eventRepository.getHostForConfirmEvent();
        for (Event event : events) {
            log.info(" Enter -> [ ScheduleService confirmAlramToHost() ] account.name : {} ", event.getAccount().getName());

            // 알림톡 발송 준비
            Map<String, String> replace = new HashMap<>();
            replace.put("meetingName", event.getTitle());
            replace.put("eventId", event.getRandomId());
            // 알림톡 발송
            messageService.sendAlimtalk(event.getAccount(), "notconfirm", replace);
        }

        // 각 일정 사람들에게 각각 정한 시간때에 가는 리마인더
        List<Participants> possibleParticipants = participantsRepository.getPossibleParticipants();
        for (Participants participants : possibleParticipants) {
            log.info(" Enter -> [ ScheduleService sendReminder() ] participants.name : {} ", participants.getAccount().getName());

            // 알림톡 발송 준비
            Map<String, String> replace = new HashMap<>();
            replace.put("reminder", switchString(calculatorDate(participants.getEvent().getConfirmedAt(), participants.getRemindDate())));
            replace.put("meetingName", participants.getEvent().getTitle());
            replace.put("meetingTime", formatTime(participants.getEvent(), participants.getAccount().getTimezone()));
            replace.put("meetingPlace", participants.getEvent().getAddressDetail().equals("") ? "온라인" : participants.getEvent().getAddressDetail());
            replace.put("timeZone", participants.getAccount().getTimezone());
            replace.put("eventId", participants.getEvent().getRandomId());
            // 시간 지났으면 전송
            messageService.sendAlimtalk(participants.getAccount(), "reminder2", replace);

        }
    }


    // 확정 시간이 지나면 일정 disable 처리를 위한 리마인더더
//    @Scheduled(cron = "0/30 * * * * *")    // 테스트 : 30초마다 실행
    @Scheduled(cron = "0 1/30 * * * *")    // 업로드  : 매시간 1분, 31분마다 실행
    @Transactional
    public void checkTimeForDisable() {
        log.info(" Enter -> [ ScheduleService checkTimeForDisable() ] ");
        List<Event> events = eventRepository.getByState("ACTIVE");
        for (Event event : events) {
            log.info(" Enter -> [ ScheduleService checkTimeForDisable() ] {} , now : {} , confirmedAt : {}", event.getTitle(), LocalDateTime.now(), event.getConfirmedAt());
            if (LocalDateTime.now().isAfter(event.getConfirmedAt())) {
                event.changeStateByScheduler("DISABLE");
            }
        }
    }

    private long calculatorDate(LocalDateTime confirmAt, LocalDateTime remindAt) {
        long eventTime = Timestamp.valueOf(confirmAt).getTime();
        long personalTime = Timestamp.valueOf(remindAt).getTime();
        return TimeUnit.MILLISECONDS.toHours(eventTime - personalTime);
    }

    private String switchString(long calculatorTime) {
        String result = "";
        int temp = (int) calculatorTime;
        switch (temp) {
            case 1:
                result = "1시간";
                break;
            case 24:
                result = "1일";
                break;
            case 168:
                result = "7일";
                break;
        }
        return result;
    }

    private String formatTime(Event event, String timezone) {
        String result = LocalDateTime.ofInstant(Instant.ofEpochMilli(Timestamp.valueOf(event.getConfirmedAt()).getTime()), ZoneId.of(timezone)).format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 a hh:mm ~").withLocale(Locale.forLanguageTag("ko")));
        result += LocalDateTime.ofInstant(Instant.ofEpochMilli(Timestamp.valueOf(event.getConfirmedAt().plusMinutes(Long.parseLong(event.getDuration()))).getTime()), ZoneId.of(timezone)).format(DateTimeFormatter.ofPattern(" a hh:mm").withLocale(Locale.forLanguageTag("ko")));
//        String result = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 a hh:mm ~ ").withLocale(Locale.forLanguageTag("ko")).format(event.getConfirmedAt());
//        LocalDateTime localDateTime = event.getConfirmedAt().plusMinutes(Long.parseLong(event.getDuration()));
//        result += DateTimeFormatter.ofPattern(" a hh:mm").withLocale(Locale.forLanguageTag("ko")).format(localDateTime);
        return result;
    }
}
