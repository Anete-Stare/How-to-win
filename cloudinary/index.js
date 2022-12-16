const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'KaLaimet',
        allowedFormats: ['jpeg', 'png', 'jpg', 'heic'],
        transformation: [
            { width: 400, height: 300, gravity: "auto", crop: "fill" },
        ],
        format: 'jpg',
        limits: { fileSize: 1048576 },
    },
});

module.exports = {
    cloudinary,
    storage
}
