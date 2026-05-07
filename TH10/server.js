const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let onlineUsers = {};

io.on('connection', (socket) => {
    console.log(`[+] User connected: ${socket.id}`);

    //Đăng nhập
    socket.on('join', (username) => {
        onlineUsers[socket.id] = username;
        io.emit('update_users', onlineUsers); 
    });

    //Private Chat
    socket.on('private_message', (data) => {
        const { to, message } = data;
        const time = new Date().toLocaleTimeString();
        const senderName = onlineUsers[socket.id];

        if (onlineUsers[to]) {
            io.to(to).emit('receive_message', { 
                sender: senderName, 
                message: message, 
                time: time, 
                fromId: socket.id 
            });
        }

        socket.emit('receive_message', { 
            sender: 'Bạn', 
            message: message, 
            time: time, 
            fromId: to 
        });
    });

    //Đóng tab/Mất mạng
    socket.on('disconnect', () => {
        console.log(`[-] User disconnected: ${socket.id}`);
        delete onlineUsers[socket.id];
        io.emit('update_users', onlineUsers);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server Chat đang chạy tại http://localhost:${PORT}`);
});