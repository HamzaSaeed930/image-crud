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

    // Return the correct multer middleware based on the upload type
    if (type === "array") {
        return uploadMiddleware.array(fieldName); // For multiple files
    } else {
        return uploadMiddleware.single(fieldName); // For a single file
    }
};

module.exports = upload;
