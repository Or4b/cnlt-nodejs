const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/contact.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/post.html'));
});

// Chạy server
app.listen(4000, () => {
    console.log('Server dang chay tai port 4000...');
});