package com.kezuler.service;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kezuler.common.AppProperties;
import com.kezuler.config.security.UserDetailsImpl;
import com.kezuler.domain.*;
import com.kezuler.dto.EventDto;
import com.kezuler.exception.CustomException;
import com.kezuler.exception.ExceptionCode;
import com.kezuler.repository.*;
import com.kezuler.utility.HttpClient;
import com.kezuler.utility.HttpResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import org.springframework.util.ObjectUtils;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.json.JSONObject.NULL;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarService {

    private final AppProperties app;
    private final ObjectMapper objectMapper;
    private final AccountRepository accountRepository;
    private final EventRepository eventRepository;
    private final GoogleCalendarRepository googleCalendarRepository;
    private final GoogleEventRepository googleEventRepository;
    private final ParticipantsRepository participantsRepository;

    public String getSocialOauthUrl(String redirectUri, String state) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(app.getGoogleRequestTokenUri())
                .queryParam("client_id", app.getGoogleClientId())
                .queryParam("scope", "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email")
                .queryParam("redirect_uri", "https://nftmonster.kr" + redirectUri)
                .queryParam("response_type", "code")
                .queryParam("approval_prompt", "force")
                .queryParam("access_type", "offline")
                .queryParam("state", state);
        return builder.toUriString();
    }

//    @Transactional
//    public void createCalendarTokenAndConnectFirst(String kakaoId, JSONObject tokenObject, JSONObject authObject) {
//        Account account = accountRepository.findByKakaoId(kakaoId)
//                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_ACCOUNT.getCode(),
//                        ExceptionCode.NOT_FOUND_ACCOUNT.getMessage()));
//
//        account.updateGoogleToggle(true);
//
//        String access = tokenObject.getString("access_token");
//        String refresh = tokenObject.getString("refresh_token");
//        String googleSub = authObject.getString("sub");
//        String googleEmail = authObject.getString("email");
//
//        Optional<GoogleCalendar> optGoogleCalendar = googleCalendarRepository.findByAccount(account);
//        GoogleCalendar googleCalendar = null;
//        if (optGoogleCalendar.isPresent()) {
//            googleCalendar = optGoogleCalendar.get();
//            googleCalendar.update(access, refresh, googleSub, googleEmail);
//        } else {
//            googleCalendar = googleCalendarRepository.save(GoogleCalendar.builder()
//                    .access(access)
//                    .refresh(refresh)
//                    .sub(googleSub)
//                    .email(googleEmail)
//                    .account(account)
//                    .build());
//        }
//        List<Participants> activeParticipants =
//                participantsRepository.getActiveParticipants(account.getId());
//
//        for (Participants participants : activeParticipants) {
//            JSONObject jsonObject = insertEvent(account, participants.getEvent(), googleCalendar);
//            String eventKey = makeGoogleEvent(jsonObject);
//            GoogleEvent googleEvent = GoogleEvent.builder()
//                    .eventKey(eventKey)
//                    .account(account)
//                    .event(participants.getEvent())
//                    .build();
//            googleEventRepository.save(googleEvent);
//        }
//    }

    @Transactional
    public void createCalendarTokenAndConnectFirst(Account userdetails, JSONObject tokenObject, JSONObject authObject) {
        Account account = accountRepository.findById(userdetails.getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_ACCOUNT.getCode(),
                        ExceptionCode.NOT_FOUND_ACCOUNT.getMessage()));

        account.updateGoogleToggle(true);

        String access = tokenObject.getString("access_token");
        String refresh = tokenObject.getString("refresh_token");
        String googleSub = authObject.getString("sub");
        String googleEmail = authObject.getString("email");

        Optional<GoogleCalendar> optGoogleCalendar = googleCalendarRepository.findByAccount(account);
        GoogleCalendar googleCalendar = null;
        if (optGoogleCalendar.isPresent()) {
            googleCalendar = optGoogleCalendar.get();
            googleCalendar.update(access, refresh, googleSub, googleEmail);
        } else {
            googleCalendar = googleCalendarRepository.save(GoogleCalendar.builder()
                    .access(access)
                    .refresh(refresh)
                    .sub(googleSub)
                    .email(googleEmail)
                    .account(account)
                    .build());

            List<Participants> activeParticipants =
                    participantsRepository.getActiveParticipants(account.getId());

            for (Participants participants : activeParticipants) {

                Optional<GoogleEvent> optGoogleEvent = googleEventRepository.findByAccountAndEvent(participants.getAccount(), participants.getEvent());
                if (optGoogleEvent.isEmpty()) {
                    JSONObject jsonObject = insertEvent(account, participants.getEvent(), googleCalendar);
                    String eventKey = makeGoogleEvent(jsonObject);
                    GoogleEvent googleEvent = GoogleEvent.builder()
                            .eventKey(eventKey)
                            .account(account)
                            .event(participants.getEvent())
                            .build();
                    googleEventRepository.save(googleEvent);
                }
            }
        }
    }

    @Transactional
    public void insertEventByHost(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));
        List<Participants> activeParticipants = participantsRepository.getEventActiveParticipants(event.getId());

        for (Participants participants : activeParticipants) {
            if (participants.getAccount().isGoogleCalendarToggle()) {

                Optional<GoogleCalendar> optGoogleCalendar = renewalAccessToken(participants.getAccount());
                if (optGoogleCalendar.isPresent()) {

                    Optional<GoogleEvent> optGoogleEvent = googleEventRepository.findByAccountAndEvent(participants.getAccount(), event);
                    if (optGoogleEvent.isEmpty()) {
                        GoogleCalendar googleCalendar = optGoogleCalendar.get();
                        JSONObject jsonObject = insertEvent(participants.getAccount(), participants.getEvent(), googleCalendar);
                        String eventKey = makeGoogleEvent(jsonObject);
                        GoogleEvent googleEvent = GoogleEvent.builder()
                                .eventKey(eventKey)
                                .account(googleCalendar.getAccount())
                                .event(participants.getEvent())
                                .build();
                        googleEventRepository.save(googleEvent);
                    }
                }
            }
        }
    }

    @Transactional
    public void insertEventByReattenedGuest(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));

        Optional<GoogleCalendar> optGoogleCalendar = renewalAccessToken(userDetails.getAccount());

        if (optGoogleCalendar.isPresent()) {
            GoogleCalendar googleCalendar = optGoogleCalendar.get();

            Optional<GoogleEvent> optGoogleEvent = googleEventRepository.findByAccountAndEvent(userDetails.getAccount(), event);
            if (optGoogleEvent.isEmpty()) {
                JSONObject jsonObject = insertEvent(userDetails.getAccount(), event, googleCalendar);
                String eventKey = makeGoogleEvent(jsonObject);
                GoogleEvent googleEvent = GoogleEvent.builder()
                        .eventKey(eventKey)
                        .account(googleCalendar.getAccount())
                        .event(event)
                        .build();
                googleEventRepository.save(googleEvent);
            }
        }
    }

    @Transactional
    public void cancelEventByHost(String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));
        List<GoogleEvent> googleEvents = googleEventRepository.findByEvent(event);
        for (GoogleEvent googleEvent : googleEvents) {
            if (googleEvent.getAccount().isGoogleCalendarToggle()) {
                Optional<GoogleCalendar> optGoogleCalendar = renewalAccessToken(googleEvent.getAccount());
//                Optional<GoogleCalendar> optGoogleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount());
                if (optGoogleCalendar.isPresent()) {
                    JSONObject resultObject = deleteEvent(optGoogleCalendar.get(), googleEvent);
                    if (resultObject == null) {
                        googleEventRepository.deleteById(googleEvent.getId());
                    }
                }
            }
        }

    }

    public JSONObject insertEvent(Account account, Event event, GoogleCalendar googleCalendar) {
        JSONObject bodyJson = makeInsertBody(account, event);
        HttpResult objects = HttpClient.postWithAuthorize(app.getGoogleCldUri() + googleCalendar.getEmail() + "/events", bodyJson.toString(), app.getJwtPrifix() + googleCalendar.getAccess(), 1000);
        JSONObject resultObject = new JSONObject(objects.getData());
        log.info("resultObject: {}", resultObject);
        return resultObject;
    }

    public JSONObject deleteEvent(GoogleCalendar googleCalendar, GoogleEvent googleEvent) {
        HttpResult objects = HttpClient.deleteWithAuthorize(app.getGoogleCldUri() + googleCalendar.getEmail() + "/events/" + googleEvent.getEventKey(), null, app.getJwtPrifix() + googleCalendar.getAccess(), 1000);
        log.info("object data: {}", objects.getData());
        log.info("object status: {}", objects.getStatus());

        if (objects.getStatus() == 204) {
            return null;
        } else {
            return new JSONObject(objects.getData());
        }
    }


    public String makeGoogleEvent(JSONObject jsonObject) {
        return jsonObject.getString("id");
    }

    public JSONObject makeInsertBody(Account account, Event event) {

//        String start = event.getConfirmedAt().atZone(ZoneId.of(account.getTimezone()))
//                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneId.of(account.getTimezone())));
//        String end = event.getConfirmedAt().plusMinutes(Long.parseLong(event.getDuration()))
//                .atZone(ZoneId.of(account.getTimezone()))
//                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneId.of(account.getTimezone())));

        String start = LocalDateTime.ofInstant(Instant.ofEpochMilli(Timestamp.valueOf(event.getConfirmedAt()).getTime()), ZoneId.of(account.getTimezone())).format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
        String end = LocalDateTime.ofInstant(Instant.ofEpochMilli(Timestamp.valueOf(event.getConfirmedAt().plusMinutes(Long.parseLong(event.getDuration()))).getTime()), ZoneId.of(account.getTimezone())).format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));

//        log.info("::::::::: start : {}", start);
//        log.info("::::::::: start1  : {}", Timestamp.valueOf(event.getConfirmedAt()).getTime());
//        log.info("::::::::: start2  : {}", LocalDateTime.ofInstant(Instant.ofEpochMilli(Timestamp.valueOf(event.getConfirmedAt()).getTime()), ZoneId.of(account.getTimezone())));
//        log.info("::::::::: start3  : {}", LocalDateTime.ofInstant(Instant.ofEpochMilli(Timestamp.valueOf(event.getConfirmedAt()).getTime()), ZoneId.of(account.getTimezone())).format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
//        log.info("::::::::: end : {}", end);

        JSONObject bodyJson = new JSONObject();
        bodyJson.put("summary", event.getTitle());
        bodyJson.put("description", replaceVariable(event));

        JSONObject startJson = new JSONObject();
        startJson.put("timeZone", account.getTimezone());
        startJson.put("dateTime", start);

        JSONObject endJson = new JSONObject();
        endJson.put("timeZone", account.getTimezone());
        endJson.put("dateTime", end);

        bodyJson.put("start", startJson);
        bodyJson.put("end", endJson);

        return bodyJson;
    }

    private static String replaceVariable(Event event) {
        String origin = new StringBuilder()
                .append("미팅 정보 확인하기: https://kezuler.com/main/fixed/#{eventId}/info")
                .append("\n")
                .append("미팅 취소하기 : https://kezuler.com/main/fixed/#{eventId}/info")
                .toString();
        String format = "#\\{eventId\\}";
        origin = origin.replaceAll(format, event.getRandomId());
        return origin;
    }

    @Transactional
    public Optional<GoogleCalendar> renewalAccessToken(Account userDetails) {
        Account account = accountRepository.findById(userDetails.getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getCode(),
                ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getMessage()));
        Optional<GoogleCalendar> optGoogleCalendar = googleCalendarRepository.findByAccount(account);
        if (optGoogleCalendar.isPresent()) {
            GoogleCalendar googleCalendar = optGoogleCalendar.get();
            String param = "grant_type=refresh_token&client_id=" + app.getGoogleClientId() + "&client_secret=" + app.getGoogleClientSecret() + "&refresh_token=" + googleCalendar.getRefresh();
            HttpResult objects = HttpClient.post(app.getGoogleRefreshTokenUri(), param, 1000);
            JSONObject resultObject = new JSONObject(objects.getData());
            if (objects.getStatus() == 400) {
                log.info("resultObject: {}", objects.getStatus());
                log.info("resultObject: {}", resultObject);
                account.updateGoogleToggle(false);
                return Optional.ofNullable(null);
            }
            log.info("resultObject: {}", resultObject);

            String access_token = resultObject.getString("access_token");
            log.info("new access token: {}", resultObject);

            googleCalendar.updateAccess(access_token);
        }
        return optGoogleCalendar;
    }

    @Transactional
    public JSONObject getCalendarsAllEvent(UserDetailsImpl userDetails, EventDto.Target dto) {
        Optional<GoogleCalendar> optGoogleCalendar = renewalAccessToken(userDetails.getAccount());

        JSONObject result = new JSONObject();


        if (optGoogleCalendar.isEmpty()) {
            log.info("::::::::::::::::: EMPTY");
        } else {
            GoogleCalendar googleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount())
                    .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getCode(),
                            ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getMessage()));

            LocalDateTime target = LocalDateTime.of(dto.getYear(), dto.getMonth(), dto.getDay(), 00, 00);
            String timeMin = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'hh:mm:ss'Z'").format(target.minusHours(24));
            String timeMax = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'hh:mm:ss'Z'").format(target.plusHours(24));
            HttpResult objects = HttpClient.getWithAuthorize(app.getGoogleCldUri() + googleCalendar.getEmail() + "/events?timeMax=" + timeMax + "&timeMin=" + timeMin + "&orderBy=updated"  , app.getJwtPrifix() + googleCalendar.getAccess(), 1000);

            JSONObject resultObject = new JSONObject(objects.getData());
            log.info("resultObject: {}", resultObject);

            JSONArray resultArr = resultObject.getJSONArray("items");
            List<JSONObject> resultList = new ArrayList<>();
            JSONArray resArr = new JSONArray();
            for (int i = 0; i < resultArr.length(); i++) {
                JSONObject jsonObject = resultArr.getJSONObject(i);
                resultList.add(jsonObject);
            }
            for (JSONObject res : resultList) {
                log.info("::::::::::::::::::::::::::::::::::::::::: {}", res.getString("id"));

                if (res.has("start")) {
                    JSONObject start = res.getJSONObject("start");
                    if (start.has("dateTime")) {
                        String dateTime = start.getString("dateTime");
                        String timeZone = start.optString("timeZone", userDetails.getAccount().getTimezone());
                        if (tofTargetDateTime(dto, dateTime, timeZone)) {
                            log.info(":::::::::::::::::::::::::::::::::::::::::");
                            JSONObject end = res.getJSONObject("end");

                            Map<String, Object> resultMap = new HashMap<>();
                            resultMap.put("start", Long.parseLong(replaceDateTimeToTimeStamp(dateTime, timeZone)));
                            resultMap.put("end", Long.parseLong(replaceDateTimeToTimeStamp(end.getString("dateTime"), timeZone)));
                            resultMap.put("title", res.optString("summary", "untitled"));
                            resultMap.put("isAllDay", false);
                            resArr.put(resultMap);
                        }
                    } else {
                        String date = start.getString("date");
                        String timeZone = start.optString("timeZone", userDetails.getAccount().getTimezone());
                        if (tofTargetDate(dto, date, timeZone)) {
                            log.info(":::::::::::::::::::::::::::::::::::::::::");
                            JSONObject end = res.getJSONObject("end");

                            Map<String, Object> resultMap = new HashMap<>();
                            resultMap.put("start", Long.parseLong(replaceDateToTimeStamp(date, timeZone)));
                            resultMap.put("end", Long.parseLong(replaceDateToTimeStamp(end.getString("date"), timeZone)));
                            resultMap.put("title", res.optString("summary", "untitled"));
                            resultMap.put("isAllDay", true);
                            resArr.put(resultMap);
                        }
                    }
                }

            }

            List<JSONObject> jsonValues = new ArrayList<JSONObject>();
            JSONArray sortedJsonArray = new JSONArray();
            for (int i = 0; i < resArr.length(); i++) {
                jsonValues.add(resArr.getJSONObject(i));
            }
            Collections.sort(jsonValues, new Comparator<JSONObject>() {
                @Override
                public int compare(JSONObject o1, JSONObject o2) {
                    Long valA = o1.getLong("start");
                    Long valB = o2.getLong("start");

                    return valA.compareTo(valB);
                }
            });
            for (int i = 0; i < resArr.length(); i++) {
                sortedJsonArray.put(jsonValues.get(i));
            }
            result.put("result", sortedJsonArray);
        }

        return result;

    }

//    @Transactional
//    public JSONObject getCalendarsAllEvent(UserDetailsImpl userDetails, EventDto.Target dto) {
//        GoogleCalendar googleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount())
//                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getCode(),
//                        ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getMessage()));
//
//        HttpResult objects = HttpClient.getWithAuthorize(app.getGoogleCldUri() + googleCalendar.getEmail() + "/events?timeZone=" + userDetails.getAccount().getTimezone(), app.getJwtPrifix() + googleCalendar.getAccess(), 1000);
//        JSONObject resultObject = new JSONObject(objects.getData());
//        log.info("resultObject: {}", resultObject);
//
//        JSONObject result = new JSONObject();
//
//        String error = resultObject.optString("error", null);
//        if (error != null) {
//            renewalAccessToken(userDetails.getAccount());
//            Map<String, String> resultMap = new HashMap<>();
//            resultMap.put("code", "-5003");
//            resultMap.put("message", "구글 access 가 만료되어 갱신을 요청했습니다. 다시한번 해당 api를 호출해 주십시오.");
//            result.put("result",resultMap);
//        } else {
//            JSONArray resultArr  = resultObject.getJSONArray("items");
//            List<JSONObject> resultList = new ArrayList<>();
//            JSONArray resArr = new JSONArray();
//            for (int i = 0; i < resultArr.length(); i++) {
//                JSONObject jsonObject = resultArr.getJSONObject(i);
//                resultList.add(jsonObject);
//            }
//            for (JSONObject res : resultList) {
//                log.info(":::::::::::::::::::::::::::::::::::::::::  {}", res.getString("summary"));
//                JSONObject start = res.getJSONObject("start");
//                if (start.has("dateTime")) {
//                    String dateTime = start.getString("dateTime");
//                    String timeZone = start.optString("timeZone", userDetails.getAccount().getTimezone());
//                    if (tofTargetDateTime(dto, dateTime, timeZone)) {
//                        log.info(":::::::::::::::::::::::::::::::::::::::::");
//                        JSONObject end = res.getJSONObject("end");
//
//                        Map<String, String> resultMap = new HashMap<>();
//                        resultMap.put("start", replaceDateTimeToTimeStamp(dateTime, timeZone));
//                        resultMap.put("end", replaceDateTimeToTimeStamp(end.getString("dateTime"), timeZone));
//                        resultMap.put("title", res.optString("summary", "untitled"));
//                        resultMap.put("isAllDay", "false");
//                        resArr.put(resultMap);
////                        Map<String, String> resultMap = new HashMap<>();
////                        resultMap.put("time", replaceDateTimeToString(dateTime, end.getString("dateTime"), timeZone));
////                        resultMap.put("title", res.optString("summary", "untitled"));
////                        resultMap.put("isAllDay", "false");
////                        resArr.put(resultMap);
//                    }
//                } else {
//                    String date = start.getString("date");
//                    String timeZone = start.optString("timeZone", userDetails.getAccount().getTimezone());
//                    if (tofTargetDate(dto, date, timeZone)) {
//                        log.info(":::::::::::::::::::::::::::::::::::::::::");
//                        JSONObject end = res.getJSONObject("end");
//
//                        Map<String, String> resultMap = new HashMap<>();
//                        resultMap.put("start", replaceDateToTimeStamp(date, timeZone));
//                        resultMap.put("end", replaceDateToTimeStamp(end.getString("date"), timeZone));
//                        resultMap.put("title", res.optString("summary", "untitled"));
//                        resultMap.put("isAllDay", "true");
//                        resArr.put(resultMap);
////                        Map<String, String> resultMap = new HashMap<>();
////                        resultMap.put("time", dto.getYear() + "년" + dto.getMonth() + "월" +  dto.getDay() + "일");
////                        resultMap.put("title", res.optString("summary", "untitled"));
////                        resultMap.put("isAllDay", "true");
////                        resArr.put(resultMap);
//                    }
//                }
//
//            }
//            result.put("result", resArr);
//        }
//        return result;
//
//    }

    private boolean tofTargetDateTime(EventDto.Target dto, String dateTime, String timezone) {
        // 구글 캘린더에서 받아온 시간이 target 날짜 이면 출력

        // 일정이 10/04 이면
        ZonedDateTime after = ZonedDateTime.of(dto.getYear(), dto.getMonth(), dto.getDay() , 23, 59, 0, 0, ZoneId.of(timezone)).minusHours(24);
        ZonedDateTime before = ZonedDateTime.of(dto.getYear(), dto.getMonth(), dto.getDay() , 00, 01, 0, 0, ZoneId.of(timezone)).plusHours(24);


        DateTimeFormatter formatter
                = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");

        ZonedDateTime zdtWithZoneOffset = ZonedDateTime
                .parse(dateTime, formatter).withZoneSameInstant(ZoneId.of(timezone));

        log.info(":::::::::::: dateTime : {}", dateTime);
        log.info(":::::::::::: timezone : {}", timezone);

        log.info(":::::::::::: after : {}", after);
        log.info(":::::::::::: before : {}", before);


        log.info(":::::::::::: after : {}", zdtWithZoneOffset.isAfter(after));
        log.info(":::::::::::: before : {}", zdtWithZoneOffset.isBefore(before));

        if (zdtWithZoneOffset.isAfter(after) && zdtWithZoneOffset.isBefore(before)) {
            return true;
        } else {
            return false;
        }
    }

    private boolean tofTargetDate(EventDto.Target dto, String date, String timezone) {
        // 구글 캘린더에서 받아온 시간이 target 날짜 이면 출력

        // 일정이 10/04 이면
        ZonedDateTime after = ZonedDateTime.of(dto.getYear(), dto.getMonth(), dto.getDay(), 00, 00, 0, 0, ZoneId.of(timezone)).minusHours(24);
        ZonedDateTime before = ZonedDateTime.of(dto.getYear(), dto.getMonth(), dto.getDay(), 00, 00, 0, 0, ZoneId.of(timezone)).plusHours(24);

        LocalDateTime localDateTime = LocalDateTime.parse(date + "T00:00:00");
        ZonedDateTime zdt = ZonedDateTime.of(localDateTime, ZoneId.of(timezone));

        log.info(":::::::::::: dateTime : {}", date);
        log.info(":::::::::::: timezone : {}", timezone);

        log.info(":::::::::::: after : {}", after);
        log.info(":::::::::::: before : {}", before);


        log.info(":::::::::::: after : {}", zdt.isAfter(after));
        log.info(":::::::::::: before : {}", zdt.isBefore(before));

        if (zdt.isAfter(after) && zdt.isBefore(before)) {
            return true;
        } else {
            return false;
        }
    }

    private String replaceDateTimeToString(String start, String end, String timeZone) {
        DateTimeFormatter formatter
                = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");

        ZonedDateTime zdtStart = ZonedDateTime
                .parse(start, formatter).withZoneSameInstant(ZoneId.of(timeZone)); // 계정 타임존으로

        ZonedDateTime zdtEnd = ZonedDateTime
                .parse(end, formatter).withZoneSameInstant(ZoneId.of(timeZone)); // 계정 타임존으로

        String result = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 a hh:mm ~").withLocale(Locale.forLanguageTag("ko")).format(zdtStart);
        result += DateTimeFormatter.ofPattern(" a hh:mm").withLocale(Locale.forLanguageTag("ko")).format(zdtEnd);
        return result;
    }

    private String replaceDateTimeToTimeStamp(String dateTime, String timeZone) {
        DateTimeFormatter formatter
                = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");

        ZonedDateTime zdt = ZonedDateTime
                .parse(dateTime, formatter).withZoneSameInstant(ZoneId.of(timeZone)); // 계정 타임존으로

        Timestamp timestamp = Timestamp.valueOf(zdt.toLocalDateTime());
        return Long.toString(timestamp.getTime());
    }

    private String replaceDateToTimeStamp(String date, String timeZone) {
        Timestamp timestamp = Timestamp.valueOf(LocalDateTime.parse(date + "T00:00:00"));
        return Long.toString(timestamp.getTime());
    }

    private String replaceDateToString(String start, String end, String timeZone) {

        LocalDateTime startLdt = LocalDateTime.parse(start + "T00:00:00");
        ZonedDateTime zdtStart = ZonedDateTime.of(startLdt, ZoneId.of(timeZone));

        LocalDateTime endLdt = LocalDateTime.parse(end + "T00:00:00");
        ZonedDateTime zdtEnd = ZonedDateTime.of(endLdt, ZoneId.of(timeZone));

        String result = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일").withLocale(Locale.forLanguageTag("ko")).format(zdtStart);
        return result;
    }

    private String formatTime(Event event) {
        String result = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 a hh:mm ~ ").withLocale(Locale.forLanguageTag("ko")).format(event.getConfirmedAt());
        LocalDateTime localDateTime = event.getConfirmedAt().plusMinutes(Long.parseLong(event.getDuration()));
        result += DateTimeFormatter.ofPattern(" a hh:mm").withLocale(Locale.forLanguageTag("ko")).format(localDateTime);
        return result;
    }

    @Transactional
    public Map<String, String> requestDeleteEvent(UserDetailsImpl userDetails, String randomId) {
        Event event = eventRepository.findByRandomId(randomId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_EVENT.getCode(),
                        ExceptionCode.NOT_FOUND_EVENT.getMessage()));

        GoogleCalendar googleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getCode(),
                        ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getMessage()));

        GoogleEvent googleEvent = googleEventRepository.findByAccountAndEvent(userDetails.getAccount(), event)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_GOOGLEEVENT.getCode(),
                        ExceptionCode.NOT_FOUND_GOOGLEEVENT.getMessage()));

        JSONObject resultObject = deleteEvent(googleCalendar, googleEvent);
        log.info("resultObject: {}", resultObject);
        Map<String, String> resultMap = new HashMap<>();
        if (resultObject == null) {
            googleEventRepository.deleteById(googleEvent.getId());
        } else {
            JSONObject error = resultObject.optJSONObject("error", null);
            if (error != null) {
                int code = error.getInt("code");
                if (code == 410) {
                    resultMap.put("code", "-6001");
                    resultMap.put("message", "존재하지 않는 이벤트 입니다.");
                } else if (code == 401) {
                    renewalAccessToken(userDetails.getAccount());
                    resultMap.put("code", "-5003");
                    resultMap.put("message", "구글 access 가 만료되어 갱신을 요청했습니다. 다시한번 해당 api를 호출해 주십시오.");
                }
            }
        }
        return resultMap;

    }

    @Transactional
    public void renewalRefreshToken(JSONObject tokenObject, JSONObject authObject, String kakaoId) {
        Account account = accountRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_ACCOUNT.getCode(),
                        ExceptionCode.NOT_FOUND_ACCOUNT.getMessage()));

        if (!account.isGoogleCalendarToggle()) {
            throw new CustomException(ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getCode(), ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getMessage());
        }

        String access = tokenObject.getString("access_token");
        String refresh = tokenObject.getString("refresh_token");
        String googleSub = authObject.getString("sub");
        String googleEmail = authObject.getString("email");

        GoogleCalendar googleCalendar = googleCalendarRepository.findByAccount(account)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_ACCOUNT.getCode(),
                        ExceptionCode.NOT_FOUND_ACCOUNT.getMessage()));

        googleCalendar.update(access, refresh, googleSub, googleEmail);

    }

    @Transactional
    public void disconnectGoogleCalendar(UserDetailsImpl userDetails) {
        Account account = accountRepository.findById(userDetails.getAccount().getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_ACCOUNT.getCode(),
                        ExceptionCode.NOT_FOUND_ACCOUNT.getMessage()));
        if (!account.isGoogleCalendarToggle()) {
            throw new CustomException(ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getCode(), ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getMessage());
        }

        GoogleCalendar googleCalendar = googleCalendarRepository.findByAccount(account)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getCode(),
                        ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getMessage()));
        HttpResult objects = HttpClient.post(app.getGoogleRevokeUri(), "token=" + googleCalendar.getRefresh(), 1000);
        log.info(":::::  {}", objects.getData());
        if (objects.getStatus() == 200) {
            account.updateGoogleToggle(false);
            googleCalendarRepository.deleteById(googleCalendar.getId());
        } else {
            throw new CustomException(ExceptionCode.CANNOT_REVOKE_GOOGLECALENDAR.getCode(), ExceptionCode.CANNOT_REVOKE_GOOGLECALENDAR.getMessage());
        }
    }

    @Transactional
    public void deleteUserGoogleCalendar(GoogleCalendar googleCalendar) {

        HttpResult objects = HttpClient.post(app.getGoogleRevokeUri(), "token=" + googleCalendar.getRefresh(), 1000);
        log.info(":::::  {}", objects.getData());
        if (objects.getStatus() == 200) {
            googleCalendarRepository.deleteById(googleCalendar.getId());
        } else {
            throw new CustomException(ExceptionCode.CANNOT_REVOKE_GOOGLECALENDAR.getCode(), ExceptionCode.CANNOT_REVOKE_GOOGLECALENDAR.getMessage());
        }
    }
}
