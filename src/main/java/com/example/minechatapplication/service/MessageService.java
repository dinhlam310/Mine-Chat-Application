package com.example.minechatapplication.service;

import com.example.minechatapplication.entity.Message;
import com.example.minechatapplication.repository.ChatRepository;
import com.example.minechatapplication.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    public void SaveMessage(Message message){
        messageRepository.save(message);
    }
}
