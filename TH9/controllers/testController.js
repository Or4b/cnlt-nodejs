const fs = require('fs');

// Tạo file rác ảo ngay trên RAM bằng vòng lặp để chặn CPU
const heavySync = (req, res) => {
    console.log("-> Đang xử lý Heavy SYNC (Đồng bộ)...");
    let sum = 0;
    for(let i = 0; i < 5e9; i++) { sum += i; } 
    console.log("<- Hoàn thành Heavy SYNC");
    res.json({ message: "Xong tác vụ đồng bộ nặng" });
};

const heavyAsync = (req, res) => {
    console.log("-> Đang xử lý Heavy ASYNC (Bất đồng bộ)...");
    setTimeout(() => {
        console.log("<- Hoàn thành Heavy ASYNC");
        res.json({ message: "Xong tác vụ bất đồng bộ nặng" });
    }, 3000);
};

module.exports = { heavySync, heavyAsync };