import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Configure Multer in-memory storage for handling files before uploading to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only image and PDF files are allowed"));
        }
    },
});

export const uploadBufferToCloudinary = async (
    buffer: Buffer,
    folder: string = "smart_residence/complaint_resolutions",
    publicIdPrefix?: string
): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicIdPrefix ? `${publicIdPrefix}_${Date.now()}` : undefined,
                resource_type: "auto",
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error || new Error("Failed to upload file to Cloudinary"));
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        uploadStream.end(buffer);
    });
};

export default cloudinary;
