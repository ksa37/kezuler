package com.kezuler.repository;

import com.kezuler.domain.Account;
import com.kezuler.domain.GoogleCalendar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GoogleCalendarRepository extends JpaRepository<GoogleCalendar, Long> {

    Optional<GoogleCalendar> findByAccount(Account account);

    void deleteByAccount(Account account);
}
