const express = require('express');
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/blogDB')
    .then(() => console.log('Kết nối MongoDB thành công'))
    .catch((error) => console.log('Lỗi kết nối MongoDB:', error));


// 1. Trang chủ: Truy vấn toàn bộ bài viết từ Database và gửi ra giao diện
app.get('/', async (req, res) => {
    const posts = await BlogPost.find({}).sort({ _id: -1 });
    res.render('index', { posts });
});

// 2. Trang Form: Hiển thị giao diện để người dùng nhập bài viết mới
app.get('/blogposts/new', (req, res) => {
    res.render('create');
});

// 3. Xử lý Form: Nhận dữ liệu người dùng submit và lưu thẳng vào Database
app.post('/blogposts/store', async (req, res) => {
    await BlogPost.create({
        title: req.body.title,
        body: req.body.body
    });
    res.redirect('/'); // Lưu xong thì tự động quay về trang chủ
});

// 4. Trang Chi tiết: Tìm đúng 1 bài viết trong Database theo ID và hiển thị
app.get('/blogposts/:id', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('detail', { post });
});

// Route hiển thị Form Sửa bài viết
app.get('/blogposts/edit/:id', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('edit', { post });
});

// Route xử lý cập nhật dữ liệu vào DB
app.post('/blogposts/update/:id', async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body
    });
    res.redirect('/');
});

// Route xử lý Xóa bài viết
app.post('/blogposts/delete/:id', async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/');
});
app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});