package com.gproject.backend.controller;

import com.gproject.backend.domain.ChatMessage;
import com.gproject.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    /**
     * 채팅 메시지 전송
     * /pub/chat
     * {
     *   "chatRoomId": "roomId",
     *   "sender": "userId",
     *   "content": "메시지 내용"
     * }
     */
    @MessageMapping("/chat")
    @SendTo("/sub/chat")
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        chatService.saveMessage(message); // MongoDB 저장
        chatService.publishMessage("chat", message); // Redis Pub/Sub
        return message;
    }
} 