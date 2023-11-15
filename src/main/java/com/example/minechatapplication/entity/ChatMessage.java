package com.example.minechatapplication.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
//@Entity
//@Table(name = "chat_message")
public class ChatMessage {

    private MessageType type;
    private String content;
    private String sender;

}
