package com.kezuler.domain;

import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDateTime;

@Builder
@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Participants extends BaseEntity{

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participants_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column
    private String role;

    @Column
    private String state;

    @Column
    private String stateInfo;

    @Column
    private boolean canceled;

    @Column
    private boolean deleted;

    @Column
    private LocalDateTime remindDate;

    public void updateVotingStatusAccept(String times) {
        state = "ACCEPT";
        stateInfo = times;
    }

    public void updateVotingStatusDecline(String reason) {
        state = "UNDEFINE";
        stateInfo = reason;
    }

    public void updateStateToDelete() {
        deleted = true;
    }

    public void updateStateToCancel() {
        canceled = true;
    }

    public void updateStateToReAttend() {
        canceled = false;
    }

    public void updateState(String state) {
        this.state = state;
    }

    public void setRemindDate(LocalDateTime remindDate) {
        this.remindDate = remindDate;
    }

}
