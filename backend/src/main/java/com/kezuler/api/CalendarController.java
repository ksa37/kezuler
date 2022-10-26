package com.kezuler.api;

import com.kezuler.common.AppProperties;
import com.kezuler.common.ResponseSet;
import com.kezuler.config.security.UserDetailsImpl;
import com.kezuler.domain.GoogleCalendar;
import com.kezuler.dto.EventDto;
import com.kezuler.dto.TokenDto;
import com.kezuler.exception.CustomException;
import com.kezuler.exception.ExceptionCode;
import com.kezuler.service.AuthService;
import com.kezuler.service.CalendarService;
import com.kezuler.utility.HttpClient;
import com.kezuler.utility.HttpResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Enumeration;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CalendarController {

    private final AuthService authService;
    private final CalendarService calendarService;
    private final AppProperties app;

//    // 구글 연동 링크
//    @GetMapping("/calendars/link")
//    public ResponseEntity<ResponseSet> getGoogleLink(@AuthenticationPrincipal UserDetailsImpl userDetails) {
//        String accessToken = authService.getAccessToken(userDetails);
//        String socialOauthUrl = calendarService.getSocialOauthUrl("/auth/google", accessToken);
//        ResponseSet responseSet = new ResponseSet(socialOauthUrl);
//        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
//    }
//
//    // 구글 캘린더 redirect 최초
//    @GetMapping("/auth/google")
//    public void loginByGoogle(@RequestParam("code") String token, HttpServletRequest request, RedirectAttributes redirectAttributes) {
//        log.info(" Enter -> [ CalendarController @GET /calendars/google ] ");
//
//        // 요청 의 state 에 access token 을 보냈음 이걸로 kakao id 를 알아냄
//        String kakaoId = authService.getUniqueId(request.getParameter("state"));
//
//        String clientId = app.getGoogleClientId();
//        String clientSecret = app.getGoogleClientSecret();
//        String redirectUri = "https://nftmonster.kr" + "/auth/google";
//
//        HttpResult result = HttpClient.post(app.getGoogleAccessTokenUri(), "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=" + redirectUri + "&code=" + token + "&grant_type=authorization_code");
//        log.info("result.getStatus(): {}", result.getStatus());
//        log.info("result.getData(): {}", result.getData());
//        log.info("result: {}", result);
//        // 토큰 정보 받아서 access 와 refresh 저장
//        JSONObject tokenObject = new JSONObject(result.getData());
//        String authKey = "Bearer " + tokenObject.getString("access_token");
//
//        // 이걸로 email 받아옴
//        HttpResult objects = HttpClient.getWithAuthorize(app.getGoogleAuthenticationUri() + "/userinfo", authKey);
//        JSONObject authObject = new JSONObject(objects.getData());
//        log.info("resultObject: {}", authObject);
//
//        // 구글에서 받은 토큰 정보 저장하며 확정된 이벤트들 insert 실시
////        calendarService.createCalendarTokenAndConnectFirst(kakaoId, tokenObject, authObject);
//
//    }

    // 구글 캘린더 프론트에서 보내줌
    @GetMapping("/calendars/google")
    public ResponseEntity<ResponseSet> authGoogle(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                  @RequestParam("code") String token) {
        log.info(" Enter -> [ CalendarController @GET /calendars/google ] ");
        log.info(" code : {} ", token);
        String clientId = app.getGoogleClientId();
        String clientSecret = app.getGoogleClientSecret();

        HttpResult result = HttpClient.post(app.getGoogleAccessTokenUri(), "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=postmessage&code=" + token + "&grant_type=authorization_code");
        log.info("result.getStatus(): {}", result.getStatus());
        log.info("result.getData(): {}", result.getData());
        log.info("result: {}", result);
        // 토큰 정보 받아서 access 와 refresh 저장
        JSONObject tokenObject = new JSONObject(result.getData());
        String authKey = "Bearer " + tokenObject.getString("access_token");

        // 이걸로 email 받아옴
        HttpResult objects = HttpClient.getWithAuthorize(app.getGoogleAuthenticationUri() + "/userinfo", authKey);
        JSONObject authObject = new JSONObject(objects.getData());
        log.info("resultObject: {}", authObject);

        // 구글에서 받은 토큰 정보 저장하며 확정된 이벤트들 insert 실시
        calendarService.createCalendarTokenAndConnectFirst(userDetails.getAccount(), tokenObject, authObject);

        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    // 구글 캘린더 사용자 event 리스트
    @GetMapping("/calendars")
    public String getCalendars(@AuthenticationPrincipal UserDetailsImpl userDetails,
                               @RequestParam("year") int year,
                               @RequestParam("month") int month,
                               @RequestParam("day") int day) {

        JSONObject calendarsAllEvent = calendarService.getCalendarsAllEvent(userDetails, new EventDto.Target(year, month, day));
        return calendarsAllEvent.toString();
    }

//    // 게스트가 취소함
//    @DeleteMapping("/calendars/{eventId}")
//    public ResponseEntity<ResponseSet> postCalendars(@AuthenticationPrincipal UserDetailsImpl userDetails,
//                                                     @PathVariable String eventId) {
//        log.info(" Enter -> [ CalendarController @DELETE /calendars/{} ]  ", eventId);
//
//        Map<String, String> map = null;
//        if (userDetails.getAccount().isGoogleCalendarToggle()) {
//            map = calendarService.requestDeleteEvent(userDetails, eventId);
//        }
//        ResponseSet responseSet = new ResponseSet(map);
//        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
//    }

//    // 호스트가 확정함
//    @PostMapping("/calendars/{eventId}/host")
//    public ResponseEntity<ResponseSet> confirmByHost(@AuthenticationPrincipal UserDetailsImpl userDetails,
//                                                     @PathVariable String eventId) {
//        log.info(" Enter -> [ CalendarController @POST /calendars/{}/host ]  ", eventId);
//        calendarService.insertEventByHost(userDetails, eventId);
//        ResponseSet responseSet = new ResponseSet();
//        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
//    }
//
//    // 호스트가 취소
//    @DeleteMapping("/calendars/{eventId}/host")
//    public ResponseEntity<ResponseSet> cancelByHost(@AuthenticationPrincipal UserDetailsImpl userDetails,
//                                                    @PathVariable String eventId) {
//        log.info(" Enter -> [ CalendarController @DELETE /calendars/{}/host ]  ", eventId);
//        calendarService.cancelEventByHost(userDetails, eventId);
//        ResponseSet responseSet = new ResponseSet();
//        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
//    }

    @GetMapping("/calendars/renewal")
    public ResponseEntity<ResponseSet> renewalAccessToken(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails.getAccount().isGoogleCalendarToggle()) {
            String accessToken = authService.getAccessToken(userDetails);
            String socialOauthUrl = calendarService.getSocialOauthUrl("/auth/renewal", accessToken);
            ResponseSet responseSet = new ResponseSet(socialOauthUrl);
            return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
        } else {
            throw new CustomException(ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getCode(), ExceptionCode.NOT_FOUND_GOOGLECALENDAR.getMessage());
        }
    }

//    // 구글 캘린더 refresh 재요청
//    @GetMapping("/auth/renewal")
//    public void renewalGoogle(@RequestParam("code") String token, HttpServletRequest request) {
//        log.info(" Enter -> [ CalendarController @GET /calendars/google/renewal ] ");
//
//        String kakaoId = authService.getUniqueId(request.getParameter("state"));
//
//        String clientId = app.getGoogleClientId();
//        String clientSecret = app.getGoogleClientSecret();
//        String redirectUri = app.getHost() + "/auth/renewal";
//
//        HttpResult result = HttpClient.post(app.getGoogleAccessTokenUri(), "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=" + redirectUri + "&code=" + token + "&grant_type=authorization_code");
//        log.info("result.getStatus(): {}", result.getStatus());
//        log.info("result.getData(): {}", result.getData());
//        log.info("result: {}", result);
//        JSONObject tokenObject = new JSONObject(result.getData());
//        String authKey = "Bearer " + tokenObject.getString("access_token");
//
//        HttpResult objects = HttpClient.getWithAuthorize(app.getGoogleAuthenticationUri() + "/userinfo", authKey);
//        JSONObject authObject = new JSONObject(objects.getData());
//        log.info("resultObject: {}", authObject);
//
//        // 구글에서 받은 토큰 정보 저장하며 확정된 이벤트들 insert 실시
//        calendarService.renewalRefreshToken(tokenObject, authObject, kakaoId);
//
//    }

    // 구글 연동 해제
    @DeleteMapping("/calendars")
    public ResponseEntity<ResponseSet> disconnectGoogleCalendar(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info(" Enter -> [ CalendarController @DELETE /calendars  {} ]  ", userDetails.getAccount().getName());
        calendarService.disconnectGoogleCalendar(userDetails);
        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

}
