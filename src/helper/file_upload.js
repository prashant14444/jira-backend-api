import multer from 'multer';
import * as dotenv from 'dotenv'

dotenv.config(); // loading all the .env variables

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.oasis.opendocument.spreadsheet': 'ods',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/zip': 'zip',
    'application/vnd.rar': 'rar',
    'video/webm': 'webm',
    'video/mpeg': 'mpeg',
    'video/mp4': 'mp4',
    'audio/mpeg': 'mp3',
    'image/webp': 'webp',
    'text/plain': 'txt',
    'application/json': 'json',
    'text/html': 'html',
    'text/csv': 'csv',
    'text/css': 'css',
    'image/gif': 'gif',

};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        const ext = file.mimetype.split("/")[1];
        cb(uploadError, process.env.DOCUMENT_UPLOADS_PATH);
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        file.filesystem_name = `${req.user.id}-${fileName}-${Date.now()}.${extension}`;
        cb(null, file.filesystem_name);
    },
});

const uploadOptions = multer({ storage: storage });

export default uploadOptions;