import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, callback) => {
        const name = file.originalname?.toLowerCase() || "";
        const allowed = file.mimetype?.startsWith("image/")
            || file.mimetype === "application/pdf"
            || file.mimetype === "application/msword"
            || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            || file.mimetype === "application/octet-stream"
            || /\.(pdf|doc|docx|jpg|jpeg|png|webp|gif)$/i.test(name);
        if (!allowed) {
            callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "file"));
            return;
        }
        callback(null, true);
    }
}).single("file");

export const imageUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (!file.mimetype?.startsWith("image/")) {
            callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "file"));
            return;
        }
        callback(null, true);
    }
}).single("file");

export const profileUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        const name = file.originalname?.toLowerCase() || "";
        const isImage = file.mimetype?.startsWith("image/")
            || /\.(jpg|jpeg|png|webp|gif)$/i.test(name);
        const isResume = file.mimetype === "application/pdf"
            || file.mimetype === "application/msword"
            || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            || file.mimetype === "application/octet-stream"
            || /\.(pdf|doc|docx)$/i.test(name);
        if (file.fieldname === "profilePhoto") {
            if (!isImage) {
                callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "profilePhoto"));
                return;
            }
        } else if (file.fieldname === "resume") {
            if (!isResume) {
                callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "resume"));
                return;
            }
        }
        callback(null, true);
    }
}).fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 }
]);