const express = require('express');
const userController = require('../controllers/usercontroller');
const router = express.Router();
const imageUpload = require('../util/uploadimage').upload;
const { validateAuth, checkAuth} = require('../middleware/auth-middleware');

router.get('/id', validateAuth, userController.getUserID);
router.get('/profile', validateAuth, userController.getClientUserProfile);
router.put('/profile', validateAuth, imageUpload.single("profilePicture"), userController.updateProfile);
router.get('/profile/:uuid', checkAuth, userController.getExternalUserProfile);

module.exports = router