package com.kezuler.dto;

import lombok.*;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class EventDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GetPending {
        private String eventId;
        private AccountDto.GetHost eventHost;
        private String eventTitle;
        private String eventDescription;
        private String eventTimeDuration;
        private List<AccountDto.GetDecliner> declinedUsers;
        private List<AccountDto.GetCandidates> eventTimeCandidates;
        private String addressType;
        private String addressDetail;
        private String eventAttachment;
        private boolean disable;
        private String state;

    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GetFixed {
        private String eventId;
        private AccountDto.GetFixedAccount eventHost;
        private String eventTitle;
        private String eventDescription;
        private String eventTimeDuration;
        private Long eventTimeStartsAt;
        private List<AccountDto.GetFixedAccount> participants;
        private String addressType;
        private String addressDetail;
        private String eventAttachment;
        private boolean disable;
        private String state;

    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Post {
        @Size(min = 1, max = 15)
        private String eventTitle;
        @Size(max = 100)
        private String eventDescription;
        @Size(min = 1, max = 5)
        private String eventTimeDuration;
        private List<Long> eventTimeCandidates;
        private String eventAttachment;
        @Size(min = 1, max = 10)
        private String addressType;
        private String addressDetail;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Update {
        @Size(max = 11)
        private String eventId;
        @Size(min = 1, max = 15)
        private String eventTitle;
        @Size(max = 100)
        private String eventDescription;
        @Size(min = 1, max = 10)
        private String addressType;
        private String addressDetail;
        private String eventAttachment;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VoteTime {
        private List<Long> addTimeCandidates;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DeclineReason {
        @Size(max = 100)
        private String userDeclineReason;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Fixed {
        private String pendingEventId;
        private Long  eventTimeStartsAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Reminder {
        private Integer remindDate;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Target {
        private Integer year;
        private Integer month;
        private Integer day;
    }

}
