package com.example.minechatapplication.repository;

import com.example.minechatapplication.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
