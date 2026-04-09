const EventEmitter = require('events');

// Tạo class kế thừa từ EventEmitter
class AppEmitter extends EventEmitter {}

// Khởi tạo một đối tượng phát sự kiện
const myEmitter = new AppEmitter();

// 1. Đăng ký sự kiện 'userAction' (chạy nhiều lần)
myEmitter.on('userAction', (actionName, user) => {
    console.log(`[EVENT LOG] Người dùng '${user}' vừa thực hiện hành động: ${actionName} lúc ${new Date().toLocaleTimeString()}`);
});

// 2. Đăng ký sự kiện 'firstBlood' (chạy đúng 1 lần duy nhất bằng lệnh once)
myEmitter.once('firstBlood', () => {
    console.log(`[EVENT LOG VIP] >>> SỰ KIỆN NÀY CHỈ KÍCH HOẠT ĐÚNG 1 LẦN DUY NHẤT! <<<`);
});

// Xuất đối tượng này ra để server.js sử dụng
module.exports = myEmitter;