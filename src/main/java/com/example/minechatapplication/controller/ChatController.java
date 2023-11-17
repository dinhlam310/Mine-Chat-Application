package com.example.minechatapplication.controller;

import com.example.minechatapplication.entity.Account;
import com.example.minechatapplication.entity.Chat;
import com.example.minechatapplication.entity.Message;
import com.example.minechatapplication.repository.AccountRepository;
import com.example.minechatapplication.repository.ChatRepository;
import com.example.minechatapplication.repository.MessageRepository;
import com.example.minechatapplication.service.MessageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private MessageService messageService;

    @ModelAttribute("ACCOUNT")
    public Account initAccount() {
        return new Account();
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public Message sendMessage(@Payload Message message) {
        Account sender = accountRepository.findAccountById(message.getAccount().getId());
        Message message1 = new Message();
        message1.setAccount(sender);
        message1.setChat(message.getChat());
        message1.setContent(message.getContent());
        message1.setTimestamp(Timestamp.from(Instant.now()));
        messageService.SaveMessage(message1);
        return message;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public Message addUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        Message temp = message;
        Account account = accountRepository.findAccountById(temp.getAccount().getId());
        headerAccessor.getSessionAttributes().put("username", account.getName());
        return message;
    }

    @GetMapping(value = "/getReceiverAccount/{id}")
    public String SelectMessage(@PathVariable("id") long id , @RequestParam("name") String name, Model model) {
        Account receiveAccount = accountRepository.findAccountById(id);
        Account senderAccount1 = accountRepository.findAccountByName(name);
        Chat  ChatList1 = chatRepository.findAllByAccount1AndAccount2(receiveAccount , senderAccount1);
        ObjectMapper objectMapper2 = new ObjectMapper();
        String ChatList = null;
        try {
            ChatList = objectMapper2.writeValueAsString(ChatList1);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        ObjectMapper objectMapper1 = new ObjectMapper();
        String senderAccount = null;
        try {
            senderAccount = objectMapper1.writeValueAsString(senderAccount1);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        model.addAttribute("ChatList", ChatList);
        model.addAttribute("ChatList1", ChatList1);
        model.addAttribute("SenderAccount" , senderAccount);
        model.addAttribute("SenderAccount1" , senderAccount1);
        return "PrivateChat";
    }

    @GetMapping(value = "/")
    public String LoginForm(){
        return "index";
    }

    @GetMapping(value= "/loginAccount")
    public String LoginAccount(@Valid String name, Model model){
        Account account = accountRepository.findAccountByName(name);
        if(account != null){
            List<Account> accountList = accountRepository.findAll();
            accountList.remove(account);

            model.addAttribute("accountList", accountList);
            model.addAttribute("SenderAccount", account);

            return "loginSuccess :: chatNavigation";
        }
        return null;
    }

}
