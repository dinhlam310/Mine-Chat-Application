'use strict';

var usernamePage = document.querySelector('#username-page'); // thẻ div lớn trước khi tham gia phiên làm việc
var chatPage = document.querySelector('#chat-page');         // thẻ div lớn sau khi tham gia phiên làm việc
var usernameForm = document.querySelector('#usernameForm');  // Form bên trong username-page
var messageForm = document.querySelector('#messageForm');    // Form bên trong chat-page
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');// khu vuc chat , gom event va chat-message
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

// function connect(event) {
//     username = document.querySelector('#name').value.trim(); // lấy trường nhập tên khi muốn tham gia phiên làm việc
//
//     if(username) {
//         usernamePage.classList.add('hidden');
//         chatPage.classList.remove('hidden');
//
//         var socket = new SockJS('/ws'); //Dòng này tạo một đối tượng kết nối WebSocket tới đường dẫn '/ws'. Đối tượng SockJS là một thư viện JavaScript hỗ trợ kết nối WebSocket trên các trình duyệt không hỗ trợ WebSocket trực tiếp.
//         stompClient = Stomp.over(socket); //Dòng này tạo một khách hàng Stomp mới sử dụng đối tượng kết nối WebSocket socket. Thư viện Stomp.js là một thư viện JavaScript cho phép giao tiếp với máy chủ WebSocket sử dụng giao thức Stomp.
//
//         stompClient.connect({}, onConnected, onError); //Dòng này kết nối khách hàng Stomp với máy chủ WebSocket. Đối tượng rỗng {} được truyền làm tham số đầu tiên để chỉ định các tiêu chí kết nối tùy chọn
//     }
//     event.preventDefault();
// }

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


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    let senderAccId = document.getElementById("senderAccountId").getAttribute("data-sender-id");
    let senderAccName = document.getElementById("senderAccountName").getAttribute("data-sender-name");
    let chatId = document.getElementById("chatListId").getAttribute("chat-list-id");
    let chatAcc1 = document.getElementById("chatListAcc1").getAttribute("chat-list-acc1");
    let chatAcc2 = document.getElementById("chatListAcc2").getAttribute("chat-list-acc2");
    let chatMess = document.getElementById("chatListMess").getAttribute("chat-list-mess");
    let chatMess1 = document.getElementById("chatListMess1").dataset.chatListMess1;

    let chatList = document.getElementById("chatList").getAttribute("chat-list");

    var timeChat = new Date();

    let account={
        id : senderAccId,
        name : senderAccName
    };

    let messages = JSON.parse(chatMess)

    let chat={
        id : chatId,
        account1 : JSON.stringify(chatAcc1),
        account2 : JSON.stringify(chatAcc2),
        messages : chatMess
    };

    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        let message = {
            timestamp: timeChat,
            content: messageInput.value,
            chat: chat,
            account : account,
        };

        let messageParse = JSON.parse(message)
            stompClient.send("/app/chat.addUser", {}, JSON.stringify(message))
            connectingElement.classList.add('hidden');
    }
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {

    let senderAccId = document.getElementById("senderAccountId").getAttribute("data-sender-id");
    let senderAccName = document.getElementById("senderAccountName").getAttribute("data-sender-name");
    let chatId = document.getElementById("chatListId").getAttribute("chat-list-id");
    let chatAcc1 = document.getElementById("chatListAcc1").getAttribute("chat-list-acc1");
    let chatAcc2 = document.getElementById("chatListAcc2").getAttribute("chat-list-acc2");
    let chatAcc1Id = document.getElementById("chatListAcc1Id").getAttribute("chat-list-acc1");
    let chatAcc2Id = document.getElementById("chatListAcc2Id").getAttribute("chat-list-acc2");
    let chatAcc1Name = document.getElementById("chatListAcc1Name").getAttribute("chat-list-acc1");
    let chatAcc2Name = document.getElementById("chatListAcc2Name").getAttribute("chat-list-acc2");
    let chatMess = document.getElementById("chatListMess").getAttribute("chat-list-mess");
    let chatMess1 = document.getElementById("chatListMess1").dataset.chatListMess1;

    let chatList = document.getElementById("chatList").getAttribute("chat-list");

    var timeChat = new Date();

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

    let messages = JSON.parse(chatMess)

    let chat={
        id : chatId,
        account1 : account1,
        account2 : account2,
        messages : chatMess
    };

    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        let message = {
            timestamp: timeChat,
            content: messageInput.value,
            chat: chat,
            account : account,
        };
        if(message.timestamp && message.content && message.chat && message.account){
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
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

    messageArea.appendChild(messageElement);
    // messageArea.scrollTop = messageArea.scrollHeight;
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