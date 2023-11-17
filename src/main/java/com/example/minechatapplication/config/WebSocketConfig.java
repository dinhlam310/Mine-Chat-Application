package com.example.minechatapplication.config;

import com.example.minechatapplication.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.socket.WebSocketHandler;


import org.springframework.messaging.simp.config.*;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.*;
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private MessageService messageService;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();// endpoint được đăng ký là "/ws" và được cấu hình để sử dụng SockJS
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app"); // sử dụng tiền tố "/app" cho các đích ứng dụng
        registry.enableSimpleBroker("/topic"); //  sử dụng các kênh tin nhắn với tiền tố "/topic" trên máy chủ.
    }

//    @Bean
//    public WebSocketHandler webSocketHandler() {
//        return new CustomWebSocketHandler();
//    }
//
//    @Override
//    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
//        registration.setMessageSizeLimit(1024 * 1024);
//    }
//
//    @Override
//    public void configureClientInboundChannel(ChannelRegistration registration) {
//        registration.interceptors(webSocketInterceptor());
//    }
//
//    @Bean
//    public WebSocketInterceptor webSocketInterceptor() {
//        return new CustomWebSocketInterceptor();
//    }
//
    @Bean
    public SimpMessagingTemplate messagingTemplate() {
        return new SimpMessagingTemplate(new MessageChannel() {
            @Override
            public boolean send(Message<?> message, long timeout) {
                // Xử lý việc gửi tin nhắn tới kênh đích
                // Trong trường hợp này bạn có thể sử dụng code tùy chỉnh để gửi tin nhắn tới kênh đích
                // Ví dụ: sử dụng WebSocketSession để gửi tin nhắn tới người dùng cụ thể
                String destination = (String) message.getHeaders().get("simpDestination");
                String chatId = extractChatIdFromDestination(destination);
                // Gửi tin nhắn tới kênh đích dựa trên chatId
                // Ví dụ: webSocketSession.sendMessage(new TextMessage(message.getPayload().toString()));
                return true;
            }

            @Override
            public boolean send(Message<?> message) {
                return send(message, 0);
            }
        });
    }

    private String extractChatIdFromDestination(String destination) {
        // Phân tích và trích xuất chatId từ destination
        // Ví dụ: "/topic/chat/123" -> "123"
        String[] parts = destination.split("/");
        return parts[parts.length - 1];
    }
}
