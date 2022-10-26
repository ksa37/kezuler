package com.kezuler.repository;

import com.kezuler.domain.Account;
import com.kezuler.domain.Event;
import com.kezuler.domain.Participants;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ParticipantsRepository extends JpaRepository<Participants, Long> {
    Optional<Participants> findByAccountAndEvent(Account account, Event event);

    List<Participants> findByEvent(Event event);

    List<Participants> findByEventAndRole(Event event, String role);

    List<Participants> findByAccount(Account account);

    List<Participants> findByEventAndState(Event event, String state);

    Page<Participants> findByEvent(Event event, Pageable pageable);

    int countByAccountAndEvent(Account account, Event event);

    @Query("SELECT p" +
            " FROM Participants p" +
            " WHERE p.account.id = :id" +
            " AND p.event.state IN ('NONE', 'CANCEL')" +
            " AND p.deleted = false" +
            " ORDER BY p.event.createdAt desc")
    Page<Participants> getPendingEvents(@Param("id")Long id, Pageable pageable);


//    @Query("SELECT p" +
//            " FROM Participants p" +
//            " WHERE p.account.id = :id" +
//            " AND p.event.state NOT IN ('NONE', 'CANCEL')" +
//            " AND p.deleted = false" +
//            " ORDER BY p.event.confirmedAt ASC")
//    Page<Participants> getFixedEvents(@Param("id")Long id, Pageable pageable);

    @Query("SELECT p" +
            " FROM Participants p" +
            " WHERE p.event.id = :id" +
            " AND p.canceled = false" +
            " AND p.deleted = false")
    List<Participants> getPossibleActive(@Param("id")Long id);

    @Query(value = "SELECT *" +
            " FROM participants p" +
            " INNER JOIN event e" +
            " ON p.event_id = e.event_id" +
            " WHERE e.state = 'ACTIVE'" +
            " AND p.deleted = FALSE" +
            " AND p.canceled = FALSE" +
            " AND p.remind_date IS not null" +
            " AND TIMESTAMPDIFF(MINUTE,NOW(),DATE_FORMAT(p.remind_date,'%Y-%m-%d %H:%i:%S')) BETWEEN -1 AND 0",
    nativeQuery = true)
    List<Participants> getPossibleParticipants();

    @Query("SELECT p" +
            " FROM Participants p" +
            " WHERE p.account.id = :id" +
            " AND p.event.state = 'ACTIVE'" +
            " AND p.state = 'ACTIVE'" +
            " AND p.canceled = false" +
            " AND p.deleted = false ")
    List<Participants> getActiveParticipants(@Param("id")Long id);

    @Query("SELECT p" +
            " FROM Participants p" +
            " WHERE p.event.id = :id" +
            " AND p.event.state = 'ACTIVE'" +
            " AND p.state = 'ACTIVE'" +
            " AND p.canceled = false" +
            " AND p.deleted = false ")
    List<Participants> getEventActiveParticipants(@Param("id")Long id);


    void deleteByEvent(Event event);

    void deleteByAccount(Account account);

}
