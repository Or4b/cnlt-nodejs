const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();

app.use(express.json());

// BÀI 3: CẤU HÌNH SESSION
app.use(session({
    secret: 'bao_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } 
}));

// DỮ LIỆU TẠM THỜI (Giả lập Database)
let students = [
    { id: 1, name: 'Nguyen Van A', email: 'a@gmail.com' },
    { id: 2, name: 'Tran Thi B', email: 'b@gmail.com' },
    { id: 3, name: 'Le Van C', email: 'c@gmail.com' },
];

// Hàm hỗ trợ Validate Email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// BÀI 1 & 5: API QUẢN LÝ SINH VIÊN

// [MỞ RỘNG] - TÌM KIẾM 
// GET /students/search?name=...
app.get('/students/search', (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Vui lòng nhập tên cần tìm" });

    const result = students.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
    res.status(200).json(result);
});

// LẤY DANH SÁCH & PHÂN TRANG (BÀI 5)
// GET /students?page=1&limit=2
app.get('/students', (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page && limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedData = students.slice(startIndex, endIndex);
        return res.status(200).json({
            page: page,
            limit: limit,
            total: students.length,
            data: paginatedData
        });
    }

    res.status(200).json(students);
});

// LẤY CHI TIẾT 1 SINH VIÊN
// GET /students/:id
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    if (!student) return res.status(404).json({ error: "Không tìm thấy sinh viên" });
    res.status(200).json(student);
});

// THÊM SINH VIÊN & VALIDATE
// POST /students
app.post('/students', (req, res) => {
    const { name, email } = req.body;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: "Tên không được rỗng và phải >= 2 ký tự" });
    }
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: "Email không đúng định dạng" });
    }
    if (students.some(s => s.email === email)) {
        return res.status(400).json({ error: "Email đã tồn tại" });
    }

    const newStudent = {
        id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
        name: name,
        email: email
    };
    students.push(newStudent);
    res.status(201).json({ message: "Thêm thành công", data: newStudent });
});

// CẬP NHẬT SINH VIÊN
// PUT /students/:id
app.put('/students/:id', (req, res) => {
    const studentIndex = students.findIndex(s => s.id == req.params.id);
    if (studentIndex === -1) return res.status(404).json({ error: "Không tìm thấy sinh viên" });

    const { name, email } = req.body;
    
    if (name && name.trim().length < 2) return res.status(400).json({ error: "Tên phải >= 2 ký tự" });

    students[studentIndex] = { ...students[studentIndex], name: name || students[studentIndex].name, email: email || students[studentIndex].email };
    res.status(200).json({ message: "Cập nhật thành công", data: students[studentIndex] });
});

// XÓA SINH VIÊN
// DELETE /students/:id
app.delete('/students/:id', (req, res) => {
    const studentIndex = students.findIndex(s => s.id == req.params.id);
    if (studentIndex === -1) return res.status(404).json({ error: "Không tìm thấy sinh viên" });

    students.splice(studentIndex, 1);
    res.status(200).json({ message: "Xóa thành công" });
});

// BÀI 2: BLOCKING VS NON-BLOCKING

// Blocking (Đồng bộ)
app.get('/sync', (req, res) => {
    console.log("1. Bắt đầu đọc file (Sync)");
    const data = fs.readFileSync('data.txt', 'utf8');
    console.log("2. Đọc xong file (Sync)");
    res.status(200).json({ data: data });
    console.log("3. Đã trả kết quả cho Client (Sync)");
});

// Non-blocking (Bất đồng bộ)
app.get('/async', (req, res) => {
    console.log("1. Bắt đầu đọc file (Async)");
    fs.readFile('data.txt', 'utf8', (err, data) => {
        console.log("3. Đọc xong file (Async) - Callback chạy");
        if (err) return res.status(500).json({ error: "Lỗi đọc file" });
        res.status(200).json({ data: data });
    });
    console.log("2. Code vẫn chạy tiếp xuống đây không cần đợi file đọc xong (Async)");
});

// BÀI 3: QUẢN LÝ SESSION (LOGIN/LOGOUT)

// POST /login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123456') {
        req.session.user = { username: 'admin', role: 'System Admin' };
        return res.status(200).json({ message: "Đăng nhập thành công" });
    }
    res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });
});

// GET /profile (Yêu cầu đăng nhập)
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Bạn chưa đăng nhập (401 Unauthorized)" });
    }
    res.status(200).json({ message: "Thông tin cá nhân", user: req.session.user });
});

// GET /logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "Đăng xuất thành công" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});