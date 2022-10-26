package com.kezuler.domain;

import lombok.*;

import javax.persistence.*;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class GoogleCalendar extends BaseEntity {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "google_calendar_id")
    private Long id;

    @Column
    private String access;

    @Column
    private String refresh;

    @Column
    private String sub;

    @Column
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    public void update(String access, String refresh, String sub, String email) {
        this.access = access;
        this.refresh = refresh;
        this.sub = sub;
        this.email = email;
    }

    public void updateAccess(String access) {
        this.access = access;
    }
}