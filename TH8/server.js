//Tạo code mới cho file server.js, cách này dùng module express multer
const express = require("express");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

let uploadManyFiles = multer({storage: storage}).array("many-files", 17);

app.get("/", (req, res) => {
    res.send(`
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="many-files" multiple>
            <button type="submit">Upload</button>
        </form>
    `);
});

app.post("/upload", (req, res) => {
    uploadManyFiles(req, res, (err) => {
        if (err) return res.send("Lỗi upload");
        res.send("Upload nhiều file thành công.");
    });
});

app.listen(8017, () => {
    console.log("Server chạy tại http://localhost:8017");
});