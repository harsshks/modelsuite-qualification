const express = require('express');
const router = express.Router();
const multer = require('multer');
const { submitTask, getSubmission, getAllSubmissions, reviewSubmission } = require('../controllers/submissionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// ── Admin routes (defined FIRST — must come before /:taskId to avoid shadowing) ──
router.get('/admin/all', protect, adminOnly, getAllSubmissions);
router.put('/:id/review', protect, adminOnly, reviewSubmission);

// ── Talent routes ──
router.post('/:taskId', protect, upload.single('file'), submitTask);
router.get('/:taskId', protect, getSubmission);

// ── Multer error handler — returns clean 400 for rejected files ──
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10 MB.' });
    }
    // LIMIT_UNEXPECTED_FILE is used by our fileFilter for type rejections
    return res.status(400).json({ message: err.field || 'File type not allowed. Accepted: PDF, JPG, PNG, GIF, WEBP, SVG, DOC, DOCX.' });
  }
  next(err);
});

module.exports = router;
