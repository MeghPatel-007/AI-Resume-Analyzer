const multer = require('multer')

// Store file in memory (Vercel-compatible)
const storage = multer.memoryStorage()

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

// Validate PDF magic bytes directly from memory
const validatePDFContent = (req, _res, next) => {
  if (!req.file) return next()

  try {
    const buffer = req.file.buffer

    if (
      buffer[0] !== 0x25 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x44 ||
      buffer[3] !== 0x46
    ) {
      const error = new Error('Invalid PDF file.')
      error.status = 415
      return next(error)
    }
  } catch {
    return next(new Error('Failed to validate file content.'))
  }

  next()
}

module.exports = {
  upload,
  validatePDFContent,
}
