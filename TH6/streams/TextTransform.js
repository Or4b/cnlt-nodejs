const { Transform } = require('stream');

class TextTransform extends Transform {
    _transform(chunk, encoding, callback) {
        // Đọc dữ liệu vào, chuyển thành chuỗi, in hoa, rồi đẩy ra tiếp
        this.push(chunk.toString().toUpperCase());
        callback();
    }
}
module.exports = TextTransform;