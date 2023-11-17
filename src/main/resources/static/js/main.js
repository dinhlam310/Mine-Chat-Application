'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var senderAccId = document.getElementById("senderAccountId").getAttribute("data-sender-id");
var senderAccName = document.getElementById("senderAccountName").getAttribute("data-sender-name");

// var chatId = document.getElementById("chatListId").getAttribute("chat-list-id");
var chatId = document.getElementById("chatListId1").getAttribute("chat-list-id1");

var chatAcc1IdElement = document.getElementById("chatListAcc1Id");
var chatAcc1Id;

if (chatAcc1IdElement !== null) {
    chatAcc1Id = chatAcc1IdElement.getAttribute("chat-list-acc1");
} else {
    // Xử lý khi chatAcc1IdElement là null
    // Ví dụ: Gán giá trị mặc định cho chatAcc1Id
    chatAcc1Id = "";
}

var chatAcc2IdElement = document.getElementById("chatListAcc2Id");
var chatAcc2Id;

if (chatAcc2IdElement !== null) {
    chatAcc2Id = chatAcc2IdElement.getAttribute("chat-list-acc2");
} else {
    // Xử lý khi chatAcc1IdElement là null
    // Ví dụ: Gán giá trị mặc định cho chatAcc1Id
    chatAcc2Id = "";
}

var chatAcc1NameElement = document.getElementById("chatListAcc1Name");
var chatAcc1Name;

if (chatAcc1NameElement !== null) {
    chatAcc1Name = chatAcc1NameElement.getAttribute("chat-list-acc1");
} else {
    // Xử lý khi chatAcc1NameElement là null
    // Ví dụ: Gán giá trị mặc định cho chatAcc1Name
    chatAcc1Name = "";
}

var chatAcc2NameElement = document.getElementById("chatListAcc2Name");
var chatAcc2Name;

if (chatAcc2NameElement !== null) {
    chatAcc2Name = chatAcc2NameElement.getAttribute("chat-list-acc2");
} else {
    // Xử lý khi chatAcc1NameElement là null
    // Ví dụ: Gán giá trị mặc định cho chatAcc1Name
    chatAcc2Name = "";
}

var chatMessElement = document.getElementById("chatListMess");
var chatMess;

if (chatMessElement !== null) {
    chatMess = chatMessElement.getAttribute("chat-list-mess");
} else {
    // Xử lý khi chatMessElement là null
    // Ví dụ: Gán giá trị mặc định cho chatMess
    chatMess = "";
}
var timeChat = new Date();

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

// var accountContainer = document.getElementById("accountContainer1").getAttribute("account-container");
// var messageContainer = document.getElementById("messageContainer1").getAttribute("message-container");

// var accountContainer = /*[[${account.getName()}]]*/ '';
// var messageContainer = /*[[${message.getContent()}]]*/ '';
// document.addEventListener('DOMContentLoaded', function() {
//
//     var messageElement = document.createElement('li');
//
//     messageElement.classList.add('chat-message');
//
//     var avatarElement = document.createElement('i'); // khoi tao avatar
//     var avatarText = document.createTextNode(accountContainer.innerText.charAt(0));
//     avatarElement.appendChild(avatarText);
//     avatarElement.style['background-color'] = getAvatarColor(accountContainer.innerText.charAt(0));
//
//     messageElement.appendChild(avatarElement);
//
//     var usernameElement = document.createElement('span');
//     var usernameText = document.createTextNode(accountContainer.innerText);
//     usernameElement.appendChild(usernameText);
//     messageElement.appendChild(usernameElement);
//
//
//     var textElement = document.createElement('p');
//     var messageText = document.createTextNode(messageContainer.innerText);
//     textElement.appendChild(messageText);
//
//     messageElement.appendChild(textElement);
//
//     if(message.account.name == username){
//         avatarElement.style['left'] = '450px';
//         usernameElement.style['paddingLeft'] = '450px';
//         textElement.style['paddingLeft'] = '450px';
//     }
//
//     messageArea.appendChild(messageElement);
// });

function connect(event){
     username = document.querySelector('#name').value.trim();

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected(options) {
    // Subscribe to the Public Topic
    // stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.subscribe('/topic/chat/' + chatId, onMessageReceived);
    let account={
        id : senderAccId,
        name : senderAccName
    };
    let account1={
        id : chatAcc1Id,
        name : chatAcc1Name
    };
    let account2={
        id : chatAcc2Id,
        name : chatAcc2Name
    };
    let chat={
        id : chatId,
        account1 : account1,
        account2 : account2,
        messages : chatMess
    }

    if (stompClient) {
        let message = {
            timestamp: timeChat,
            content: messageInput.value,
            chat: chat,
            account : account,
        };
            stompClient.send('/app/chat.addUser/'+ chatId, {}, JSON.stringify(message))
            connectingElement.classList.add('hidden');
    }
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {
    let account={
        id : senderAccId,
        name : senderAccName
    };
    let account1={
        id : chatAcc1Id,
        name : chatAcc1Name
    };
    let account2={
        id : chatAcc2Id,
        name : chatAcc2Name
    };
    let chat={
        id : chatId,
        account1 : account1,
        account2 : account2,
        messages : chatMess
    };
    let messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        let message = {
            timestamp: timeChat,
            content: messageInput.value,
            chat: chat,
            account : account,
        };
        if(message.timestamp && message.content && message.chat && message.account){
            stompClient.send('/app/chat.sendMessage/'+ chatId, {}, JSON.stringify(message));
            messageInput.value = '';
        }
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
        // tạo thẻ li với class 'chat-message' bên trong là thẻ i với icon là chữ cái đầu
        // sau đó là thẻ span với tên ng vừa nhắn , thẻ p gồm nội dung tin nhắn
    var messageElement = document.createElement('li');

        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i'); // khoi tao avatar
        var avatarText = document.createTextNode(message.account.name[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.account.name[0]);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.account.name);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);


    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    if(message.account.name == username){
        avatarElement.style['left'] = '450px';
        usernameElement.style['paddingLeft'] = '450px';
        textElement.style['paddingLeft'] = '450px';
    }

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)