package com.kezuler.domain;

import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Leaver extends BaseEntity{

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leaver_id")
    private Long id;

    @Column
    private Long accountId;

    @Column
    private String randomId;

    @Column
    private String name;

    @Column
    private String email;

    @Column
    private String phoneNumber;

    @Column
    private String profileImage;

    @Column
    private String age;

    @Column
    private String gender;

    @Column
    private String timezone;

    @Column
    private String kakaoId;

    @Column
    private String googleCalendar;

    @Column
    private boolean googleCalendarToggle;

    @Column
    private String state;

    @Column
    private String role;
}
