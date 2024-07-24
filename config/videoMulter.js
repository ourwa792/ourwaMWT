const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const {cloudinary} = require("../config/cloudinary")


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'video-thumbnails',
    allowed_formats: ['jpg', 'png'],
    transformation: [{ width: 200, height: 150, crop: 'limit' }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // حجم الملف 2 ميغا
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('الرجاء رفع صورة بصيغة JPG أو PNG فقط'));
      //cb(null, {error: true, message: "الراجاء رفع صورة بصيغة JPG, PNG"})
    }
  }
}) // رفع صورة واحدة فقط

module.exports = upload