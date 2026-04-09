const { Duplex } = require('stream');

class EchoDuplex extends Duplex {
    _read(size) {}
    
    _write(chunk, encoding, callback) {
        // Bắt được luồng dữ liệu khách gửi lên, lập tức dội ngược lại (Echo)
        this.push(chunk); 
        callback();
    }
}
module.exports = EchoDuplex;