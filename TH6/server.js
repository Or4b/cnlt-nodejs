const http = require('http');
const fs = require('fs');
const path = require('path');
const urlModule = require('url');

// Nhúng các module tự viết
const myEmitter = require('./events/AppEmitter');
const TextTransform = require('./streams/TextTransform');
const EchoDuplex = require('./streams/EchoDuplex');

const server = http.createServer((req, res) => {
    const parsedUrl = urlModule.parse(req.url, true);
    const route = parsedUrl.pathname;

    // KHỐI 1: CÁC TRANG GIAO DIỆN CHÍNH (HTML)
    if (route === '/' || route === '/index.html') {
        fs.readFile(path.join(__dirname, 'views', 'index.html'), 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    } 
    else if (route === '/events') {
        fs.readFile(path.join(__dirname, 'views', 'events.html'), 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    }
    else if (route === '/request') {
        fs.readFile(path.join(__dirname, 'views', 'request.html'), 'utf8', (err, template) => {
            let finalHtml = template
                .replace('{{METHOD}}', req.method)
                .replace('{{URL}}', req.url)
                .replace('{{QUERY}}', JSON.stringify(parsedUrl.query))
                .replace('{{HEADERS}}', JSON.stringify(req.headers, null, 4));

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'X-Student': 'Gia Bao' });
            res.end(finalHtml);
        });
    }
    else if (route === '/streams') {
        fs.readFile(path.join(__dirname, 'views', 'streams.html'), 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    }

    // XỬ LÝ 4 LOẠI STREAMS (Từ trang /streams gửi lên)
    // 4.1 Readable: Đọc file ra màn hình
    else if (route === '/streams/read') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        fs.createReadStream(path.join(__dirname, 'data', 'story.txt')).pipe(res);
    }
    // 4.2 Writable: Ghi dữ liệu form vào file
    else if (route === '/streams/write' && req.method === 'POST') {
        const writeStream = fs.createWriteStream(path.join(__dirname, 'data', 'log.txt'), { flags: 'a' });
        req.pipe(writeStream); // Dẫn thẳng luồng dữ liệu req vào file
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h2 style="color:green">Đã ghi Stream thành công vào data/log.txt!</h2>');
        });
    }
    // 4.3 Transform: Đọc file -> In hoa -> Xuất ra
    else if (route === '/streams/transform') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        const transformStream = new TextTransform();
        fs.createReadStream(path.join(__dirname, 'data', 'story.txt'))
          .pipe(transformStream)
          .pipe(res);
    }
    // 4.4 Duplex: Bắt request -> Echo ngược lại ngay lập tức
    else if (route === '/streams/duplex' && req.method === 'POST') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        const duplexStream = new EchoDuplex();
        req.pipe(duplexStream).pipe(res);
    }

    // CÁC ENDPOINTS API THEO YÊU CẦU
    // API: Kích hoạt sự kiện
    else if (route === '/event') {
        myEmitter.emit('userAction', 'Test Endpoint /event', 'Gia Bảo');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h2>Đã trigger Event. Kiểm tra log Terminal!</h2><script>setTimeout(()=>window.close(), 1500)</script>');
    }
    // API: Trả về JSON
    else if (route === '/json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', message: 'Hệ thống hoạt động tốt', author: 'Gia Bao' }));
    }
    // API: Download file log.txt
    else if (route === '/download-log') {
        res.writeHead(200, { 
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="sys_log.txt"' // Lệnh ép trình duyệt tải file
        });
        fs.createReadStream(path.join(__dirname, 'data', 'log.txt')).pipe(res);
    }
    // API: Stream Hình ảnh
    else if (route === '/image') {
        const imgPath = path.join(__dirname, 'public', 'images', 'test.jpg');
        if (fs.existsSync(imgPath)) {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            fs.createReadStream(imgPath).pipe(res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h2>LỖI: Chưa có ảnh!</h2><p>Hãy copy 1 tấm ảnh bất kỳ, đổi tên thành <b>test.jpg</b> và bỏ vào thư mục <b>public/images/</b></p>');
        }
    }

    // LỖI 404 (Không có đường dẫn nào khớp)
    else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1 style="color:red;text-align:center;margin-top:50px;">404 - NOT FOUND</h1>');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});