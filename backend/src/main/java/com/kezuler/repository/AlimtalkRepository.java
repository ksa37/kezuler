package com.kezuler.repository;

import com.kezuler.domain.Account;
import com.kezuler.domain.Alimtalk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AlimtalkRepository extends JpaRepository<Alimtalk, Long> {
    Optional<Alimtalk> findById(Long id);

    void deleteByAccount(Account account);

    Optional<Alimtalk> findByAccountAndTypeAndEvent(Account account, String type, String event);

    @Query("SELECT a" +
            " FROM Alimtalk a" +
            " WHERE a.account.id = :id" +
            " AND a.type IN ('attend', 'attend2')" +
            " AND a.event = :event")
    List<Alimtalk> getAbleToSendParticipants(@Param("id")Long id, @Param("event")String event);
}
