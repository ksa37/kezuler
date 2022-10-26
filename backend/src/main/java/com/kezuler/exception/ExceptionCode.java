package com.kezuler.exception;

import lombok.Getter;

@Getter
public enum ExceptionCode {
    UNABLE_TO_JOIN("-1001", "회원가입 진행 중 오류가 발생했습니다. 다시 시도해 주십시오."),
    UNABLE_TO_LOGIN("-1002","로그인 진행 중 오류가 발생했습니다."),
    NOT_FOUND_ACCOUNT("-1003","회원 정보를 찾을 수 없습니다."),
    NOT_FOUND_TOKEN("-1004", "토큰을 찾을 수 없습니다."),
    INVALID_KAKAO_CHECK_OUT("-1005", "카카오톡 연결 끊기가 정상적으로 완료되지 않았습니다."),

    NOT_FOUND_EVENT("-2001", "미팅정보를 찾을 수 없습니다."),
    UNABLE_TO_MAKE_EVENT("-2002", "미팅 생성 중 에러가 발생했습니다."),
    NO_PERMISSION_EVENT("-2003","미팅에 대한 권한이 없습니다."),
    DISABLE_EVENT("-2004","호스트가 취소한 미팅입니다."),
    NO_INVITATION_EVENT("-2005","미팅에 참석할 수 없습니다."),
    INVALID_ACCESS_EVENT("-2006","미팅 상태를 확인하십시오."),

    NOT_FOUND_PARTICIPANTS("-3001", "참여자를 찾을 수 없습니다."),

    NOT_FOUND_Alimtalk("-4001", "알림톡 정보를 찾을 수 없습니다."),

    INVALID_TOKEN("-5001", "토큰이 유효하지 않습니다."),
    NOT_FOUND_GOOGLECALENDAR("-5002", "구글 캘린더 관련 정보를 찾을 수 없습니다."),
    TRY_RENEWAL_TOKEN("-5003", "만료된 구글 토큰 입니다."),
    CANNOT_REVOKE_GOOGLECALENDAR("-5004", "구글 캘린더 연동 해제 과정에서 문제가 발생했습니다."),

    NOT_FOUND_GOOGLEEVENT("-6001", "구글 일정 관련 정보를 찾을 수 없습니다.")
    ;


    private String code;
    private String message;


    ExceptionCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
