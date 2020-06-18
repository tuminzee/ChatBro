const socket = io();

//Catching it
socket.on('message', message => {
    console.log(message);
})
