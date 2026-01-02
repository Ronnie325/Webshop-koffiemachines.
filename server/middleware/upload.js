import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB

// Ensure upload directory exists
await fs.mkdir(UPLOAD_DIR, { recursive: true });

// Multer configuration
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

// Image processing middleware
export async function processImage(req, res, next) {
    if (!req.file) {
        return next();
    }

    try {
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Process and optimize image
        await sharp(req.file.buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(filepath);

        req.processedImage = {
            filename,
            path: filepath,
            url: `/uploads/${filename}`
        };

        next();
    } catch (error) {
        next(error);
    }
}

// Delete image helper
export async function deleteImage(filename) {
    try {
        const filepath = path.join(UPLOAD_DIR, filename);
        await fs.unlink(filepath);
        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}
