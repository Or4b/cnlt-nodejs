const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);

router.get('/search', postController.searchPosts);

router.get('/blogposts/new', postController.createPostForm);
router.post('/blogposts/store', postController.storePost);

router.get('/blogposts/edit/:id', postController.editPostForm);
router.post('/blogposts/update/:id', postController.updatePost);
router.post('/blogposts/delete/:id', postController.deletePost);

router.get('/blogposts/:id', postController.getPostDetail);

module.exports = router;