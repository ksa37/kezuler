package com.kezuler.domain;

import com.kezuler.dto.AccountDto;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Account extends BaseEntity {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long id;

    @Column(unique = true)
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

    @Column(unique = true)
    private String kakaoId;

    @Column
    private String password;

    @Column
    private String googleCalendar;

    @Column
    private boolean googleCalendarToggle;

    @Column
    private String state;

    @Column
    private String role;

    public void updateMypage(AccountDto.Update accountDto) {
        this.name = accountDto.getUserName();
        this.email = accountDto.getUserEmail();
        if (accountDto.getProfile().getSize() > 0) {
            this.profileImage = accountDto.getUserProfileImage();
        }
    }

    public void deleteProfile() {
        this.profileImage = null;
    }

    public void updateTimezone(String timezone) {
        this.timezone = timezone;
    }

    public void updateGoogleToggle(boolean tof) {
        this.googleCalendarToggle = tof;
    }


}
