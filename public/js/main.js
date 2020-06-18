const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room fromthe url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

//Join chatroom
socket.emit('joinroom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputRoomUsers(users);
});

//Catching the message from the server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get the msg text
    const msg = e.target.elements.msg.value;

    //Emitting the msg to server
    socket.emit('chatMessage', msg);

    //Clear the msg  inpui after submiting the message 
    e.target.elements.msg.value = '';
});


function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};

function outputRoomName(room){
    roomName.innerHTML = room;
};

function outputRoomUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
};

