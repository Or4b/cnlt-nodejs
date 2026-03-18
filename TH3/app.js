const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

const posts = [
    {
        id: 1,
        title: 'Review đồ án môn học năm 3',
        description: 'Những trải nghiệm đáng nhớ khi làm đồ án và cách chia công việc nhóm hiệu quả.',
        author: 'Gia Bảo',
        date: '18/03/2026',
        hot: true
    },
    {
        id: 2,
        title: 'Lộ trình trở thành Business Analyst',
        description: 'Cần học những kỹ năng gì để trở thành BA chuyên nghiệp từ ghế nhà trường?',
        author: 'Gia Bảo',
        date: '15/03/2026',
        hot: true
    },
    {
        id: 3,
        title: 'Góc nhìn: Có nhất thiết phải code giỏi mới làm IT?',
        description: 'Khám phá các vị trí trong ngành Hệ thống thông tin không đòi hỏi quá nhiều kỹ năng lập trình.',
        author: 'Gia Bảo',
        date: '10/03/2026',
        hot: false
    },
    {
        id: 4,
        title: 'Quản lý thời gian học tập',
        description: 'Bí kíp cân bằng giữa việc học trên trường, tự học thêm và thời gian giải trí.',
        author: 'Gia Bảo',
        date: '05/03/2026',
        hot: false
    },
    {
        id: 5,
        title: 'Các công cụ hữu ích cho sinh viên IT',
        description: 'Tổng hợp các phần mềm, tiện ích mở rộng giúp tăng hiệu suất học tập và làm việc.',
        author: 'Gia Bảo',
        date: '01/03/2026',
        hot: true
    }
];


// 1. Route Trang chủ
app.get('/', (req, res) => {
    res.render('index', { title: 'Trang chủ - Blog Cá Nhân' });
});

// 2. Route Trang danh sách bài viết
app.get('/list', (req, res) => {
    res.render('list', {
        title: 'Danh sách bài viết',
        posts: posts // Truyền mảng dữ liệu sang view
    });
});

// 3. Route Trang liên hệ
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Liên hệ với tôi' });
});

// 4. Route Động - Trang chi tiết bài viết
app.get('/detail/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(x => x.id === id);

    if (!post) {
        return res.send('<h1>Không tìm thấy bài viết này!</h1><a href="/list">Quay lại danh sách</a>');
    }

    res.render('detail', {
        title: post.title,
        post: post
    });
});

app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});