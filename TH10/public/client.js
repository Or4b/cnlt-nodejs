const socket = io();

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const joinBtn = document.getElementById('join-btn');
const usernameInput = document.getElementById('username-input');
const userList = document.getElementById('user-list');
const chatWithTitle = document.getElementById('chat-with-title');
const messagesBox = document.getElementById('messages-box');
const msgInput = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-btn');

let myUsername = '';
let myId = '';
let currentReceiverId = null;

let chatHistories = {};

// 1. Tham gia hệ thống
joinBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (name) {
        myUsername = name;
        socket.emit('join', myUsername);
        loginScreen.classList.remove('active');
        chatScreen.classList.add('active');
    }
});

// 2. Nhận danh sách User Online từ Server
socket.on('update_users', (users) => {
    userList.innerHTML = ''; // Xóa list cũ
    myId = socket.id;

    for (let id in users) {
        const li = document.createElement('li');
        li.textContent = users[id];
        
        // Nếu là chính mình -> Làm mờ
        if (id === myId) {
            li.textContent += " (Bạn)";
            li.classList.add('me');
        } else {
            // Nếu là người khác -> Cho phép Click để chat riêng
            li.addEventListener('click', () => selectUserToChat(id, users[id], li));
        }

        // Giữ lại trạng thái "Đang chọn" nếu danh sách load lại
        if (id === currentReceiverId) li.classList.add('selected');
        
        userList.appendChild(li);
    }

    // Nếu người đang chat bị ngắt kết nối
    if (currentReceiverId && !users[currentReceiverId]) {
        chatWithTitle.textContent = "Người dùng này đã thoát!";
        msgInput.disabled = true;
        sendBtn.disabled = true;
    }
});

// 3. Hàm chọn người chat
function selectUserToChat(id, name, liElement) {
    document.querySelectorAll('#user-list li').forEach(el => el.classList.remove('selected'));
    liElement.classList.add('selected');

    currentReceiverId = id;
    chatWithTitle.textContent = `Đang chat với: ${name}`;
    msgInput.disabled = false;
    sendBtn.disabled = false;

    renderChatHistory();
}

// 4. Gửi tin nhắn
sendBtn.addEventListener('click', () => {
    const msg = msgInput.value.trim();
    if (msg && currentReceiverId) {
        socket.emit('private_message', { to: currentReceiverId, message: msg });
        msgInput.value = '';
    }
});

// Bấm Enter để gửi
msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

// 5. Nhận tin nhắn trả về
socket.on('receive_message', (data) => {
    const { sender, message, time, fromId } = data;

    if (!chatHistories[fromId]) chatHistories[fromId] = [];
    
    chatHistories[fromId].push({ sender, message, time });

    if (currentReceiverId === fromId) {
        renderChatHistory();
    } else {
        console.log(`Có tin nhắn mới từ ${sender}`);
    }
});

// Hàm hiển thị tin nhắn lên màn hình
function renderChatHistory() {
    messagesBox.innerHTML = '';
    const history = chatHistories[currentReceiverId] || [];
    
    history.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('msg-item');
        // Phân biệt màu sắc: Bạn gửi (Xanh) - Người ta gửi (Trắng)
        div.classList.add(item.sender === 'Bạn' ? 'msg-outgoing' : 'msg-incoming');
        
        div.innerHTML = `
            <div class="info">${item.sender} - ${item.time}</div>
            <div class="text">${item.message}</div>
        `;
        messagesBox.appendChild(div);
    });

    messagesBox.scrollTop = messagesBox.scrollHeight;
}