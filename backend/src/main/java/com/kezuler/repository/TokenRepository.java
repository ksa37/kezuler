package com.kezuler.repository;

import com.kezuler.domain.Account;
import com.kezuler.domain.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByAccount(Account account);

    Optional<Token> findByAccountAndAccess(Account account, String access);

    void deleteByAccount(Account account);

    Optional<Token> findByAccessAndRefresh(String access, String refresh);

    Optional<Token> findByRefresh(String refresh);

}
