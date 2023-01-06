const express = require('express');
const router = express.Router();
const subjectController = require('./../controllers/subject.controllers');
const { verifyToken } = require('../middlewares/authorization');

router.get('/item/:id', verifyToken, subjectController.getSubject);
router.get('/list', verifyToken, subjectController.getSubjects);
router.post('/add', verifyToken, subjectController.addSubject);
router.post('/update', verifyToken, subjectController.updateSubject);
router.delete('/delete', verifyToken, subjectController.deleteSubject);

module.exports = router;