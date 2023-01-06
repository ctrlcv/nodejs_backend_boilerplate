const express = require('express');
const router = express.Router();
const usersController = require('./../controllers/users.controllers');
const { verifyToken } = require('../middlewares/authorization');

router.post('/signup', usersController.signup);
router.post('/signin', usersController.signin);
router.post('/accesstoken', usersController.getAccessToken);
router.post('/token', usersController.getToken);
router.post('/userinfo', verifyToken, usersController.getUserInfo);
router.post('/update', verifyToken, usersController.updateUser);

module.exports = router;