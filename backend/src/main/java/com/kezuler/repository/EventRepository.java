package com.kezuler.repository;

import com.kezuler.domain.Account;
import com.kezuler.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByIdAndAccount(Long id, Account account);

    int countByRandomId(String randomId);

    Optional<Event> findByRandomIdAndAccount(String randomId, Account account);

    Optional<Event> findByRandomId(String randomId);

    @Query("SELECT e" +
            " FROM Event e" +
            " WHERE e.state = :state" +
            " AND e.confirmedAt IS not null")
    List<Event> getByState(@Param("state")String state);

    List<Event> findByAccount(Account account);

    @Query(value = "SELECT *" +
            " FROM event e" +
            " WHERE e.state = 'NONE'" +
            " AND e.confirm_reminder is not null" +
            " AND TIMESTAMPDIFF(MINUTE,NOW(),DATE_FORMAT(e.confirm_reminder,'%Y-%m-%d %H:%i:%S')) BETWEEN -1 AND 0"
    , nativeQuery = true)
    List<Event> getHostForConfirmEvent();

    void deleteByAccount(Account account);

}
