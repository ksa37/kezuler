package com.kezuler.api;

import com.kezuler.common.AppProperties;
import com.kezuler.common.ResponseSet;
import com.kezuler.config.security.UserDetailsImpl;
import com.kezuler.domain.Event;
import com.kezuler.domain.GoogleCalendar;
import com.kezuler.domain.Participants;
import com.kezuler.dto.EventDto;
import com.kezuler.repository.EventRepository;
import com.kezuler.repository.GoogleCalendarRepository;
import com.kezuler.repository.ParticipantsRepository;
import com.kezuler.service.CalendarService;
import com.kezuler.service.MessageService;
import com.kezuler.service.ScheduleService;
import com.kezuler.utility.HttpClient;
import com.kezuler.utility.HttpResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.RequestContextUtils;

import javax.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ConnectController {


    private final AppProperties app;
    private final CalendarService calendarService;
    private final EventRepository eventRepository;
    private final ScheduleService scheduleService;
    private final GoogleCalendarRepository googleCalendarRepository;
    private final ParticipantsRepository participantsRepository;

    @GetMapping("/test")
    public ResponseEntity<ResponseSet> testGet(HttpServletRequest request) {
        log.info(":::::::::::::::::::::::::::::::::");
        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @GetMapping("/test2")
    public void test2(@AuthenticationPrincipal UserDetailsImpl userDetails) {

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

    private String formatTime(Event event) {
        String result = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일  a hh:mm ~ ").format(event.getConfirmedAt());
        LocalDateTime localDateTime = event.getConfirmedAt().plusMinutes(Long.parseLong(event.getDuration()));
        result += DateTimeFormatter.ofPattern(" a hh:mm").format(localDateTime);
        return result;
    }

//    @GetMapping("/error")
//    public ResponseEntity<ResponseSet> testError() {
//        if (true) {
//            throw new CustomException(ExceptionCode.ACCOUNT_NOT_FOUND.getCode(), ExceptionCode.ACCOUNT_NOT_FOUND.getMessage());
//        }
//        ResponseSet responseSet = new ResponseSet("success");
//        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
//    }

}
