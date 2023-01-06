const express = require('express');
const router = express.Router();
const organizationController = require('./../controllers/organization.controllers');
const { verifyToken } = require('../middlewares/authorization');

router.get('/list', verifyToken, organizationController.getOrganizations);
router.post('/add', verifyToken, organizationController.addOrganization);
router.post('/update', verifyToken, organizationController.updateOrganization);
router.delete('/delete', verifyToken, organizationController.deleteOrganization);

module.exports = router;