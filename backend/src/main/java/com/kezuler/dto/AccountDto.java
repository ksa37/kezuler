package com.kezuler.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AccountDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Update {
        @Size(min = 1, max = 20)
        private String userName;
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$")
        private String userEmail;
        private MultipartFile profile;
        private String userProfileImage;

    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateGoogleToggle {
        private boolean googleToggle;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateTimezone {
        @Size(min = 1, max = 100)
        private String timeZone;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Get {
        private String userId;
        private String userName;
        private String userEmail;
        private String userProfileImage;
        private String userPhoneNumber;
        private String userTimezone;
        private String userKakaoId;
        private TokenDto userToken;
        private boolean googleToggle;
        private boolean sugReconnect;

    }

    // Pending event 내려갈 때 호스트 정보, 승인한 사용자
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GetHost {
        private String userId;
        private String userName;
        private String userProfileImage;
        private boolean canceled;

    }

    // Fixed event 내려갈 때 호스트, 게스트 정보
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GetFixedAccount {
        private String userId;
        private String userName;
        private String userProfileImage;
        private String userStatus;

    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GetDecliner {
        private String userId;
        private String userName;
        private String userProfileImage;
        private String userDeclineReason;
        private boolean canceled;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GetCandidates {
        private Long eventStartsAt;
        private List<GetHost> possibleUsers;

    }

}
