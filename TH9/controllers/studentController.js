let students = require('../data/db');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const studentController = {
    // THỐNG KÊ TỔNG QUAN
    getStats: (req, res) => {
        const total = students.length;
        const activeStudents = students.filter(s => !s.isDeleted);
        const active = activeStudents.length;
        const deleted = total - active;
        const avgAge = active > 0 ? (activeStudents.reduce((sum, s) => sum + s.age, 0) / active) : 0;
        
        res.json({ total, active, deleted, averageAge: avgAge.toFixed(1) });
    },

    // THỐNG KÊ THEO LỚP
    getClassStats: (req, res) => {
        const activeStudents = students.filter(s => !s.isDeleted);
        const classCounts = {};
        activeStudents.forEach(s => {
            classCounts[s.class] = (classCounts[s.class] || 0) + 1;
        });
        
        const result = Object.keys(classCounts).map(c => ({ class: c, count: classCounts[c] }));
        res.json(result);
    },

    // LẤY DANH SÁCH
    getAll: (req, res) => {
        let { name, class: className, sort, page, limit } = req.query;
        
        // Chỉ lấy sinh viên chưa bị xóa
        let result = students.filter(s => !s.isDeleted);

        // Filter
        if (name) result = result.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
        if (className) result = result.filter(s => s.class === className);

        // Sort
        if (sort === 'age_desc') result.sort((a, b) => b.age - a.age);

        // Pagination
        if (page && limit) {
            page = parseInt(page); limit = parseInt(limit);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedData = result.slice(startIndex, endIndex);
            return res.json({ page, limit, total: result.length, data: paginatedData });
        }

        res.json({ total: result.length, data: result });
    },

    // LẤY 1 SINH VIÊN
    getById: (req, res) => {
        const student = students.find(s => s.id == req.params.id && !s.isDeleted);
        if (!student) return res.status(404).json({ error: "Không tìm thấy sinh viên" });
        res.json(student);
    },

    // THÊM SINH VIÊN
    create: (req, res) => {
        const { name, email, age, class: className } = req.body;

        if (!name || name.trim().length < 2) return res.status(400).json({ error: "Tên phải >= 2 ký tự" });
        if (!email || !isValidEmail(email)) return res.status(400).json({ error: "Email sai định dạng" });
        if (students.some(s => s.email === email && !s.isDeleted)) return res.status(400).json({ error: "Email đã tồn tại" });
        if (!age || age < 16 || age > 60) return res.status(400).json({ error: "Tuổi phải từ 16 đến 60" });

        const newStudent = {
            id: students.length ? students[students.length - 1].id + 1 : 1,
            name, email, age, class: className, isDeleted: false
        };
        students.push(newStudent);
        res.status(201).json({ message: "Thêm thành công", data: newStudent });
    },

    // CẬP NHẬT
    update: (req, res) => {
        const index = students.findIndex(s => s.id == req.params.id && !s.isDeleted);
        if (index === -1) return res.status(404).json({ error: "Không tìm thấy sinh viên" });

        students[index] = { ...students[index], ...req.body };
        res.json({ message: "Cập nhật thành công", data: students[index] });
    },

    // XÓA MỀM
    softDelete: (req, res) => {
        const index = students.findIndex(s => s.id == req.params.id && !s.isDeleted);
        if (index === -1) return res.status(404).json({ error: "Không tìm thấy sinh viên" });

        students[index].isDeleted = true;
        res.json({ message: "Đã xóa mềm sinh viên thành công" });
    }
};

module.exports = studentController;