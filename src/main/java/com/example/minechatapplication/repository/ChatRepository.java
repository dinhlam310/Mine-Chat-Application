package com.example.minechatapplication.repository;

import com.example.minechatapplication.entity.Account;
import com.example.minechatapplication.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
//    List<Chat> findAllByAccount1AndAccount2OrAccount2AndAccount1(Account account1, Account account2);

    @Query("SELECT c FROM Chat c WHERE (c.account1 = :account1 AND c.account2 = :account2) OR (c.account1 = :account2 AND c.account2 = :account1)")
    Chat findAllByAccount1AndAccount2(@Param("account1") Account account1, @Param("account2") Account account2);
}
