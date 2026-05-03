'use strict';



const multer = require('multer');
const { AppError } = require('./errorHandler');

//  Storage: keep the file in memory 

const storage = multer.memoryStorage();

//  File filter: only allow JPEG and PNG 


const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowed.includes(file.mimetype)) {

    return cb(new AppError(`Invalid file type "${file.mimetype}". Only JPEG, PNG and WebP are allowed.`, 400));
  }


  cb(null, true);
};


const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = { upload };
