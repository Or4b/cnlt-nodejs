const BlogPost = require('../models/BlogPost');

// 1. Lấy danh sách bài viết (Trang chủ)
const getAllPosts = async (req, res) => {
    const posts = await BlogPost.find({}).sort({ _id: -1 });
    res.render('index', { posts });
};

// 2. Hiển thị form tạo bài viết
const createPostForm = (req, res) => {
    res.render('create');
};

// 3. Lưu bài viết mới vào DB
const storePost = async (req, res) => {
    await BlogPost.create({
        title: req.body.title,
        body: req.body.body
    });
    res.redirect('/');
};

// 4. Xem chi tiết bài viết
const getPostDetail = async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('detail', { post });
};

// 5. Hiển thị form sửa bài viết
const editPostForm = async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('edit', { post });
};

// 6. Cập nhật bài viết
const updatePost = async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body
    });
    res.redirect('/');
};

// 7. Xóa bài viết
const deletePost = async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/');
};

// 8. Tìm kiếm bài viết theo tiêu đề
const searchPosts = async (req, res) => {
    const keyword = req.query.keyword;
    const posts = await BlogPost.find({
        title: { $regex: keyword, $options: 'i' }
    }).sort({ _id: -1 });
    
    res.render('index', { posts });
};

module.exports = {
    getAllPosts,
    createPostForm,
    storePost,
    getPostDetail,
    editPostForm,
    updatePost,
    deletePost,
    searchPosts
};