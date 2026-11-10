const express = require('express');
const upload = require('../config/upload');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/signup', authController.showSignUp);
router.post('/signup', upload.single('pet_image'), authController.signUp);
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
