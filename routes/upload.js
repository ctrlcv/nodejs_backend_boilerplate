const express = require('express');
const router = express.Router();
const uploadController = require('./../controllers/upload.controllers');
const { verifyToken } = require('../middlewares/authorization');

router.post('/file', uploadController.upload.array('files', 5), uploadController.uploadFiles);

module.exports = router;