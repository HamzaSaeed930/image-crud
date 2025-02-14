const express = require("express");
const imageController = require("../controllers/imageController");
const upload = require("../middlewares/multer");
const path = require("path");

const router = express.Router();

// router.post("/url", upload("image", "images", "array"), imageController.createImage);
router.post("/url", upload("image", "images", "array"), imageController.createImage);

router.put("/image/:id", upload("image", "images", "single"), imageController.updateImage);
router.delete("/image", imageController.deleteImage);
router.get("/image", (req, res) => res.status(200).send("Image Routes here"));

router.get("/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads/images", filename);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ message: "Image not found" });
        }
    });
});

module.exports = router;
