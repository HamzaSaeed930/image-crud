const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = (fieldName, folderName, type = "single") => {
    const uploadPath = path.join(__dirname, "../uploads", folderName);
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        },
    });

    const uploadMiddleware = multer({ storage });

    return type === "array"
        ? uploadMiddleware.array(fieldName)
        : uploadMiddleware.single(fieldName);
};

module.exports = upload;
