const Image = require("../models/imageModel");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://image-crud-eight.vercel.app/uploads/images/";
// https://image-crud-eight.vercel.app/api/url
const imageController = {
    async createImage(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "No images uploaded" });
            }

            const imagesToSave = req.files.map((file) => ({
                imageUrl: `images/${file.filename}`,
            }));

            const savedImages = await Image.insertMany(imagesToSave);

            const imagesWithBaseUrl = savedImages.map((image) => ({
                _id: image._id,
                imageUrl: `${BASE_URL}${image.imageUrl}`,
                createdAt: image.createdAt,
                __v: image.__v,
            }));

            return res.status(201).json({
                message: "Images uploaded successfully",
                images: imagesWithBaseUrl,
            });
        } catch (error) {
            return res.status(500).json({ message: "Error uploading images", error: error.message });
        }
    },

    async updateImage(req, res) {
        try {
            const { id } = req.params;
            const image = await Image.findById(id);

            if (!image) {
                return res.status(404).json({ message: "Image not found" });
            }

            if (!req.file) {
                return res.status(400).json({ message: "No new image uploaded" });
            }

            // Delete old image file
            const oldImagePath = path.join(__dirname, "../uploads", image.imageUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            image.imageUrl = `images/${req.file.filename}`;
            await image.save();

            return res.status(200).json({
                message: "Image updated successfully",
                image: {
                    _id: image._id,
                    imageUrl: `${BASE_URL}${image.imageUrl}`,
                    createdAt: image.createdAt,
                    __v: image.__v,
                },
            });
        } catch (error) {
            return res.status(500).json({ message: "Error updating image", error: error.message });
        }
    },

    async deleteImage(req, res) {
        try {
            const { imageUrl } = req.body;

            if (!imageUrl) {
                return res.status(400).json({ message: "imageUrl is required" });
            }

            const image = await Image.findOne({ imageUrl: imageUrl });

            if (!image) {
                return res.status(404).json({ message: "Image not found" });
            }

            const imagePath = path.join(__dirname, "../uploads", image.imageUrl);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            await Image.deleteOne({ _id: image._id });

            return res.status(200).json({ message: "Image deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting image", error: error.message });
        }
    },
};

module.exports = imageController;
