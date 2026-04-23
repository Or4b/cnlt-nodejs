const express = require('express');
const session = require('express-session');
const { logger, errorHandler } = require('./middlewares');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

app.use(session({
    secret: 'he_thong_thong_tin_qnu',
    resave: false,
    saveUninitialized: true
}));

// Áp dụng Middleware Logger toàn cầu
app.use(logger);

// Sử dụng toàn bộ Route
app.use('/', apiRoutes);

// Áp dụng Middleware Error Handler
app.use(errorHandler);

app.listen(3000, () => {
    console.log("Hệ thống TH9 API đang chạy tại http://localhost:3000");
});