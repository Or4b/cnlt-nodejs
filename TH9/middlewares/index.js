// Middleware In ra Log
const logger = (req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
};

// Middleware Bảo vệ API
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ error: "401 Unauthorized - Bạn chưa đăng nhập!" });
};

// Middleware Xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
    console.error("Lỗi hệ thống:", err.stack);
    res.status(500).json({ error: "Đã xảy ra lỗi trên Server!" });
};

module.exports = { logger, requireLogin, errorHandler };