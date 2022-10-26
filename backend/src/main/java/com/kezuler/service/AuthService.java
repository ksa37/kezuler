package com.kezuler.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.kezuler.common.AppProperties;
import com.kezuler.config.security.UserDetailsImpl;
import com.kezuler.domain.*;
import com.kezuler.dto.AccountDto;
import com.kezuler.dto.TokenDto;
import com.kezuler.exception.CustomException;
import com.kezuler.exception.ExceptionCode;
import com.kezuler.repository.*;
import com.kezuler.utility.HttpClient;
import com.kezuler.utility.HttpResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.json.JSONObject;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.Calendar;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AccountRepository accountRepository;
    private final TokenRepository tokenRepository;
    private final EventRepository eventRepository;
    private final AlimtalkRepository alimtalkRepository;
    private final GoogleCalendarRepository googleCalendarRepository;
    private final GoogleEventRepository googleEventRepository;
    private final ParticipantsRepository participantsRepository;
    private final LeaverRepository leaverRepository;
    private final CalendarService calendarService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final S3Service s3Service;
    private final AppProperties app;


    @Transactional
    public Account joinKezuler(JSONObject resultObj, String timezone) {
        log.info(" Enter -> [ AuthService joinKezuler ] ");


        String kakaoId = String.valueOf(resultObj.get("id"));
//            JSONObject properties = resultObj.getJSONObject("properties");
        JSONObject kakaoAccount = resultObj.getJSONObject("kakao_account");
        JSONObject profile = kakaoAccount.getJSONObject("profile");


        String email = null;
        String profileStorage = null;

        if (kakaoAccount.getBoolean("is_email_valid") && kakaoAccount.getBoolean("is_email_verified")) {
            email = kakaoAccount.optString("email", null);

        }

        if (!profile.getBoolean("is_default_image")) {
            String profileTmp = s3Service.uploadProfile(profile.getString("thumbnail_image_url"));
            if (profileTmp.startsWith("https://")) {
                profileStorage = profileTmp;
            }
        }

//        log.info("  -> [ AuthService joinKezuler :: save Account ] ");

        Account account = Account.builder()
                .randomId(makeAccountIndex())
                .name(profile.optString("nickname", null))
                .email(email)
                .phoneNumber(kakaoAccount.optString("phone_number", null))
                .profileImage(profileStorage)
                .age(kakaoAccount.optString("age_range", null))
                .gender(kakaoAccount.optString("gender", null))
                .timezone(timezone)
                .kakaoId(kakaoId)
                .state("ACTIVE")
                .role("ROLE_USER")
                .password(bCryptPasswordEncoder.encode(app.getJwtSecret()))
                .build();
        return accountRepository.save(account);

    }

    private String makeAccountIndex() {
        while (true) {
            log.info("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
            String resultCode = RandomStringUtils.randomAlphabetic(10);
            int count = accountRepository.countByRandomId(resultCode);
            if (count < 1) {
                return resultCode;
            }
        }
    }

    @Transactional
    public TokenDto createNewToken(Account account) {
        log.info(" Enter -> [ AuthService createNewToken ] ");

        String jwtToken = JWT.create()
                .withExpiresAt(new Date(System.currentTimeMillis() + Long.parseLong(app.getJwtAccessTime())))
                .withClaim("id", account.getId())
                .withClaim("username", account.getKakaoId())
                .sign(Algorithm.HMAC512(app.getJwtSecret()));

        String refresh = JWT.create()
                .withExpiresAt(new Date(System.currentTimeMillis() + Long.parseLong(app.getJwtRefreshTime())))
                .sign(Algorithm.HMAC512(app.getJwtSecret()));

        Optional<Token> byAccount = tokenRepository.findByAccount(account);
        Token token = null;
        if (byAccount.isPresent()) {
            token = byAccount.get();
            token.updateAccessToken(jwtToken);
            token.updateRefreshToken(refresh);
        } else {
            token = tokenRepository.save(Token.builder().access(jwtToken).refresh(refresh).account(account).build());
        }

        return TokenDto.builder()
                .tokenType(app.getJwtPrifix())
                .accessToken(token.getAccess())
                .accessTokenExpiresIn(JWT.decode(token.getAccess()).getExpiresAt())
                .refreshToken(token.getRefresh())
                .refreshTokenExpiresIn(JWT.decode(token.getRefresh()).getExpiresAt())
                .build();
    }


    public AccountDto.Get getUser(UserDetailsImpl userDetails) {

        Token token = tokenRepository.findByAccount(userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_TOKEN.getCode(),
                        ExceptionCode.NOT_FOUND_TOKEN.getMessage()));

        Optional<GoogleCalendar> optGoogleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount());

        Account account = token.getAccount();

        TokenDto tokenDto = TokenDto.builder()
                .tokenType(app.getJwtPrifix())
                .accessToken(token.getAccess())
                .accessTokenExpiresIn(JWT.decode(token.getAccess()).getExpiresAt())
                .refreshToken(token.getRefresh())
                .refreshTokenExpiresIn(JWT.decode(token.getRefresh()).getExpiresAt())
                .build();
        return AccountDto.Get.builder()
                .userId(account.getRandomId())
                .userName(account.getName())
                .userEmail(account.getEmail())
                .userProfileImage(account.getProfileImage())
                .userPhoneNumber(account.getPhoneNumber())
                .userTimezone(account.getTimezone())
                .userKakaoId(account.getKakaoId())
                .userToken(tokenDto)
                .googleToggle(account.isGoogleCalendarToggle())
                .sugReconnect(optGoogleCalendar.isPresent() == true && account.isGoogleCalendarToggle() == false)
                .build();
    }

    @Transactional
    public AccountDto.Get updateUser(UserDetailsImpl userDetails, AccountDto.Update inputDto) throws IOException {
        Token byAccount = tokenRepository.findByAccount(userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_TOKEN.getCode(),
                        ExceptionCode.NOT_FOUND_TOKEN.getMessage()));

//        log.info("::::::::: {}" , inputDto.getProfile().getOriginalFilename());
//        log.info("::::::::: {}" , inputDto.getProfile().getSize());
//        log.info("::::::::: {}" , inputDto.getProfile().getName());
//        log.info("::::::::: {}" , inputDto.getProfile().getBytes());
//        log.info("::::::::: {}" , inputDto.getProfile().getContentType());
//        log.info("::::::::: {}" , inputDto.getProfile().getResource());

        if (inputDto.getProfile().getSize() > 0) {
            try {
                String storage = s3Service.update(inputDto.getProfile(), userDetails.getAccount().getProfileImage());
                inputDto.setUserProfileImage(storage);
            } catch (Exception e) {

            }
        }

        byAccount.getAccount().updateMypage(inputDto);

        Optional<GoogleCalendar> optGoogleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount());

        TokenDto tokenDto = TokenDto.builder()
                .tokenType(app.getJwtPrifix())
                .accessToken(byAccount.getAccess())
                .accessTokenExpiresIn(JWT.decode(byAccount.getAccess()).getExpiresAt())
                .refreshToken(byAccount.getRefresh())
                .refreshTokenExpiresIn(JWT.decode(byAccount.getRefresh()).getExpiresAt())
                .build();
        return AccountDto.Get.builder()
                .userId(byAccount.getAccount().getRandomId())
                .userName(byAccount.getAccount().getName())
                .userEmail(byAccount.getAccount().getEmail())
                .userProfileImage(byAccount.getAccount().getProfileImage())
                .userPhoneNumber(byAccount.getAccount().getPhoneNumber())
                .userTimezone(byAccount.getAccount().getTimezone())
                .userKakaoId(byAccount.getAccount().getKakaoId())
                .userToken(tokenDto)
                .googleToggle(byAccount.getAccount().isGoogleCalendarToggle())
                .sugReconnect(optGoogleCalendar.isPresent() == true && byAccount.getAccount().isGoogleCalendarToggle() == false)
                .build();
    }

    @Transactional
    public AccountDto.Get deleteProfile(UserDetailsImpl userDetails) {
        Token token = tokenRepository.findByAccount(userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_TOKEN.getCode(),
                        ExceptionCode.NOT_FOUND_TOKEN.getMessage()));

        Account account = token.getAccount();

        s3Service.delete(account.getProfileImage());

        account.deleteProfile();
        Optional<GoogleCalendar> optGoogleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount());

        TokenDto tokenDto = TokenDto.builder()
                .tokenType(app.getJwtPrifix())
                .accessToken(token.getAccess())
                .accessTokenExpiresIn(JWT.decode(token.getAccess()).getExpiresAt())
                .refreshToken(token.getRefresh())
                .refreshTokenExpiresIn(JWT.decode(token.getRefresh()).getExpiresAt())
                .build();
        return AccountDto.Get.builder()
                .userId(account.getRandomId())
                .userName(account.getName())
                .userEmail(account.getEmail())
                .userProfileImage(account.getProfileImage())
                .userPhoneNumber(account.getPhoneNumber())
                .userTimezone(account.getTimezone())
                .userKakaoId(account.getKakaoId())
                .userToken(tokenDto)
                .googleToggle(account.isGoogleCalendarToggle())
                .sugReconnect(optGoogleCalendar.isPresent() == true && account.isGoogleCalendarToggle() == false)
                .build();
    }


    @Transactional
    public void deleteUser(UserDetailsImpl userDetails) {
        Account account = accountRepository.findById(userDetails.getAccount().getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_ACCOUNT.getCode(),
                        ExceptionCode.NOT_FOUND_ACCOUNT.getMessage()));

        Leaver leaver = Leaver.builder()
                .accountId(account.getId())
                .randomId(account.getRandomId())
                .name(account.getName())
                .email(account.getEmail())
                .phoneNumber(account.getPhoneNumber())
                .profileImage(account.getProfileImage())
                .age(account.getAge())
                .gender(account.getGender())
                .timezone(account.getTimezone())
                .kakaoId(account.getKakaoId())
                .googleCalendar(account.getGoogleCalendar())
                .googleCalendarToggle(account.isGoogleCalendarToggle())
                .state(account.getState())
                .role(account.getRole())
                .build();
        leaverRepository.save(leaver);


        // 본인이 호스트인 이벤트에 참여된 participants 들삭제
        List<Event> events = eventRepository.findByAccount(account);
        for (Event event : events) {
            participantsRepository.deleteByEvent(event);
        }

        // 구글 캘린더 연동 해제
        Optional<GoogleCalendar> byAccount = googleCalendarRepository.findByAccount(account);
        if (byAccount.isPresent()) {
            GoogleCalendar googleCalendar = byAccount.get();
            calendarService.deleteUserGoogleCalendar(googleCalendar);
        }
        googleEventRepository.deleteByAccount(userDetails.getAccount());

        // participant 에 있는 본인 delete 처리
        participantsRepository.deleteByAccount(account);

        // event 본인이 만든 것 삭제
        eventRepository.deleteByAccount(account);

        // alimtalk 로그 삭제
        alimtalkRepository.deleteByAccount(account);

        // 토큰테이블에서 삭제
        tokenRepository.deleteByAccount(account);
        // 회원 테이블에서 삭제
        accountRepository.deleteById(account.getId());

        // 카카오에서 연결 끊기
        HttpResult httpResult = HttpClient.postWithAuthorize(app.getKakaoCheckUri(), "target_id_type=user_id&target_id=" + userDetails.getAccount().getKakaoId(), "KakaoAK " + app.getKakaoAdminKey(), 1000);
        if (httpResult.getStatus() != 200) {
            log.info(" kakao checkout error : {}", httpResult.getData());
            throw new CustomException(ExceptionCode.INVALID_KAKAO_CHECK_OUT.getCode(), ExceptionCode.INVALID_KAKAO_CHECK_OUT.getMessage());
        }

    }



    @Transactional
    public AccountDto.Get updateTimezone(UserDetailsImpl userDetails, String timeZone) {
        Token byAccount = tokenRepository.findByAccount(userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_TOKEN.getCode(),
                        ExceptionCode.NOT_FOUND_TOKEN.getMessage()));

        byAccount.getAccount().updateTimezone(timeZone);
        Optional<GoogleCalendar> optGoogleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount());

        TokenDto tokenDto = TokenDto.builder()
                .tokenType(app.getJwtPrifix())
                .accessToken(byAccount.getAccess())
                .accessTokenExpiresIn(JWT.decode(byAccount.getAccess()).getExpiresAt())
                .refreshToken(byAccount.getRefresh())
                .refreshTokenExpiresIn(JWT.decode(byAccount.getRefresh()).getExpiresAt())
                .build();
        return AccountDto.Get.builder()
                .userId(byAccount.getAccount().getRandomId())
                .userName(byAccount.getAccount().getName())
                .userEmail(byAccount.getAccount().getEmail())
                .userProfileImage(byAccount.getAccount().getProfileImage())
                .userPhoneNumber(byAccount.getAccount().getPhoneNumber())
                .userTimezone(byAccount.getAccount().getTimezone())
                .userKakaoId(byAccount.getAccount().getKakaoId())
                .userToken(tokenDto)
                .googleToggle(byAccount.getAccount().isGoogleCalendarToggle())
                .sugReconnect(optGoogleCalendar.isPresent() == true && byAccount.getAccount().isGoogleCalendarToggle() == false)
                .build();
    }

    @Transactional
    public AccountDto.Get updateGoogleToggle(UserDetailsImpl userDetails, boolean tof) {
        Token byAccount = tokenRepository.findByAccount(userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_TOKEN.getCode(),
                        ExceptionCode.NOT_FOUND_TOKEN.getMessage()));

        byAccount.getAccount().updateGoogleToggle(tof);
        Optional<GoogleCalendar> optGoogleCalendar = googleCalendarRepository.findByAccount(userDetails.getAccount());

        TokenDto tokenDto = TokenDto.builder()
                .tokenType(app.getJwtPrifix())
                .accessToken(byAccount.getAccess())
                .accessTokenExpiresIn(JWT.decode(byAccount.getAccess()).getExpiresAt())
                .refreshToken(byAccount.getRefresh())
                .refreshTokenExpiresIn(JWT.decode(byAccount.getRefresh()).getExpiresAt())
                .build();
        return AccountDto.Get.builder()
                .userId(byAccount.getAccount().getRandomId())
                .userName(byAccount.getAccount().getName())
                .userEmail(byAccount.getAccount().getEmail())
                .userProfileImage(byAccount.getAccount().getProfileImage())
                .userPhoneNumber(byAccount.getAccount().getPhoneNumber())
                .userTimezone(byAccount.getAccount().getTimezone())
                .userKakaoId(byAccount.getAccount().getKakaoId())
                .userToken(tokenDto)
                .googleToggle(byAccount.getAccount().isGoogleCalendarToggle())
                .sugReconnect(optGoogleCalendar.isPresent() == true && byAccount.getAccount().isGoogleCalendarToggle() == false)
                .build();
    }

    public String getAccessToken(UserDetailsImpl userDetails) {
        Token token = tokenRepository.findByAccount(userDetails.getAccount())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_TOKEN.getCode(),
                        ExceptionCode.NOT_FOUND_TOKEN.getMessage()));
        return token.getAccess();
    }

    public String getUniqueId(String accessToken) {
        try {
            String username = JWT.require(Algorithm.HMAC512(app.getJwtSecret())).build().verify(accessToken)
                    .getClaim("username").asString();
            return username;
        } catch (RuntimeException e) {
            throw new CustomException(ExceptionCode.INVALID_TOKEN.getCode(), ExceptionCode.INVALID_TOKEN.getMessage());
        }

    }


    @Transactional
    public TokenDto manageToken(String refresh) throws TokenExpiredException {

        JWT.require(Algorithm.HMAC512(app.getJwtSecret())).build().verify(refresh);

        Token token = tokenRepository.findByRefresh(refresh)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_TOKEN.getCode(),
                        ExceptionCode.NOT_FOUND_TOKEN.getMessage()));

        String jwtToken = JWT.create()
                .withExpiresAt(new Date(System.currentTimeMillis() + Integer.parseInt(app.getJwtAccessTime())))
                .withClaim("id", token.getAccount().getId())
                .withClaim("username", token.getAccount().getKakaoId())
                .sign(Algorithm.HMAC512(app.getJwtSecret()));
            token.updateAccessToken(jwtToken);

            return TokenDto.builder()
                .tokenType(app.getJwtPrifix())
                .accessToken(token.getAccess())
                .accessTokenExpiresIn(JWT.decode(token.getAccess()).getExpiresAt())
                .refreshToken(token.getRefresh())
                .refreshTokenExpiresIn(JWT.decode(token.getRefresh()).getExpiresAt())
                .build();
    }
}
