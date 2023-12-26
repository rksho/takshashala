const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://127.0.0.1:5500',
    },
});

const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

// if any new user joins, let other users connected to the server know!
  socket.on('new-user-joined', (name) => {
    console.log('New user joined:', name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });
// if someone sends a message, broadcast it to other people
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

// if someone leave the chat, let others know
  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];

    });
});

const PORT = 9001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});































