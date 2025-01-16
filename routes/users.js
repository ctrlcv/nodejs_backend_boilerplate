const express = require('express');
const router = express.Router();
const usersController = require('./../controllers/users.controllers');
const { verifyToken } = require('../middlewares/authorization');

router.post('/signUp', usersController.signUp);
router.post('/signIn', usersController.signIn);
router.post('/accessToken', usersController.getAccessToken);
router.post('/userInfo', verifyToken, usersController.getUserInfo);
router.post('/update', verifyToken, usersController.updateUser);
router.post('/signInByToken', verifyToken, usersController.signInByToken);

module.exports = router;