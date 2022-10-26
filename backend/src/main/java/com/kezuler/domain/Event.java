package com.kezuler.domain;

import com.kezuler.dto.EventDto;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Event extends BaseEntity {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long id;

    @Column(unique = true)
    private String randomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column
    private String title;

    @Column
    private String description;

    @Column
    private String duration;

    @Column
    private String dates;

    @Column
    private LocalDateTime confirmedAt;

    @Column
    private String attachement;

    @Column
    private String addressType;

    @Column
    private String addressDetail;

    @Column
    private String state;

    @Column
    private String inviteCode;

    @Column
    private LocalDateTime confirmReminder;

    public void updateEvent(EventDto.Update eventDto) {
        title = eventDto.getEventTitle();
        description = eventDto.getEventDescription();
        addressType = eventDto.getAddressType();
        addressDetail = eventDto.getAddressDetail();
        attachement = eventDto.getEventAttachment();
    }

    public void cancelEvent() {
        state = "CANCEL";
        confirmedAt = null;
        confirmReminder = null;
    }

    public void updateCandidateTime(String dates) {
        this.dates = dates;
    }

    public void confirmEvent(LocalDateTime confirmTime) {
        state = "ACTIVE";
        confirmedAt = confirmTime;
    }

    public void cancelFixedEvent() {
        state = "ACTIVECANCEL";
        confirmReminder = null;
    }

    public void changeStateByScheduler(String state) {
        this.state = state;
    }
}
