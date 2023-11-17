package com.example.minechatapplication.config;

import com.example.minechatapplication.entity.Account;
import com.example.minechatapplication.entity.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.sql.Timestamp;
import java.time.Instant;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {
    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());// trích xuất thông tin từ tin nhắn
        String username = (String) headerAccessor.getSessionAttributes().get("username"); // lấy tên người dùng trong session attribute
        if (username != null) {
            log.info("user disconnected: {}", username);
            var chatMessage = Message.builder()
                    .timestamp(Timestamp.from(Instant.now()))
                    .account(Account.builder().name(username).build())
                    .build();
            messagingTemplate.convertAndSend("/topic/chat/1", chatMessage);// gửi tin nhắn thông báo cho các máy khách theo địa chỉ đó
        }
    }

}
