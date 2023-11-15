package com.example.minechatapplication.repository;

import com.example.minechatapplication.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findAccountByName (String name);

    Account findAccountById (Long id);
}
