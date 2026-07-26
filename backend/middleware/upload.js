// === backend/middleware/upload.js ===
const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');

function makeStorage(subfolder) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads', subfolder));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${nanoid(10)}${ext}`);
    }
  });
}

const imageFilter = (req, file, cb) => {
  if (/^image\//.test(file.mimetype)) return cb(null, true);
  cb(new Error('Only image files are allowed.'));
};

const pdfOrImageFilter = (req, file, cb) => {
  if (/^image\//.test(file.mimetype) || file.mimetype === 'application/pdf') {
    return cb(null, true);
  }
  cb(new Error('Only image or PDF files are allowed.'));
};

const uploadPhoto = multer({
  storage: makeStorage('photos'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadResume = multer({
  storage: makeStorage('resume'),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    cb(new Error('Resume must be a PDF file.'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadCertificate = multer({
  storage: makeStorage('certificates'),
  fileFilter: pdfOrImageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = { uploadPhoto, uploadResume, uploadCertificate };
