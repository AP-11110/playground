import express from "express";
import multer from "multer";
import { v4 as uuid } from 'uuid';
const app = express();

// single file upload
// middleware for handling the files
// const upload = multer({ dest: "uploads/" });

// -------------------------------------------------------------
// upload.single for single file uploads
// app.post("/upload", upload.single("file"), (req, res) => {
//     res.json({ status: "success" });
// });

// -------------------------------------------------------------
//multiple files upload
// app.post("/upload", upload.array("file", 2), (req, res) => {
//     res.json({ status: "success" });
// });

// -------------------------------------------------------------
// multiple fields upload
// const multiUpload = upload.fields([{ name: "avatar", maxCount: 1 }, { name: "resume", maxCount: 1 }]);
// app.post("/upload", multiUpload, (req, res) => {
//     console.log(req.files)
//     res.json({ status: "success" });
// });

// -------------------------------------------------------------
// custom file name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`)
    }
})
// const upload = multer({ storage });
// app.post("/upload", upload.array("file"), (req, res) => {
//     res.json({ status: "success" });
// });


// -------------------------------------------------------------
// custom file type with error handling
const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10000000, files: 2 }});
app.post("/upload", upload.array("file"), (req, res) => {
    res.json({ status: "success" });
});

app.use((err, req, res, next) => {
    if(err instanceof multer.MulterError) {
        if(err.code === "LIMIT_FILE_SIZE") {
            return res.json({
                message: "file is too large"
            })
        }

        if(err.code === "LIMIT_FILE_COUNT") {
            return res.json({
                message: "file limit reached"
            })
        }

        if(err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.json({
                message: "file must be an image"
            })
        }
    }
})

app.listen(4000, () => console.log("Connected"));