"use strict";
const multer = require("multer");

let storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'upload');
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },

});

const upload = multer({
  storage : storage,
  limits : {
    fileSize: 1024 * 1024 * 10
  }
});

module.exports = upload;