const multer = require('multer');
const path = require('path');

// ── Allowed MIME types (documents + images only) ──
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

// ── Allowed file extensions ──
const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.jpg', '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.doc', '.docx',
]);

// Store files locally on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// ── File filter: reject executable and disallowed file types ──
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ALLOWED_EXTENSIONS.has(ext) && ALLOWED_MIME_TYPES.has(mime)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        `File type not allowed. Accepted: PDF, JPG, PNG, GIF, WEBP, SVG, DOC, DOCX`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

module.exports = upload;
