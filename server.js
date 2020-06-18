const cool = require('cool-ascii-faces');
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatBro Bot'

//Run when a client connects 
io.on('connection', socket => {
    
    socket.on('joinroom', ({ username, room}) => {
    const user = userJoin(socket.id, username, room);
        socket.join(user.room);
    //Welcome the current user
    socket.emit('message', formatMessage(botName, 'Welcome to the ChatBro'));

    //Boradcoast message to notify eveyone that a new user has joined the chat 
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    //Send user and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })

    });




    //Receiving the msg on the server side
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Feedback message when a person leaves the chat
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
        io.to(user.room).emit('message', formatMessage(botName,`${user.username} left the chat`));
    

    //Send user and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })};


    });
    
});




const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});