package com.kezuler.repository;

import com.kezuler.domain.Account;
import com.kezuler.domain.Event;
import com.kezuler.domain.GoogleEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoogleEventRepository extends JpaRepository<GoogleEvent, Long> {

    Optional<GoogleEvent> findByAccountAndEvent(Account account, Event event);

    List<GoogleEvent> findByEvent(Event event);

    void deleteByAccount(Account account);
}
