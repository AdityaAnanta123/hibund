const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const commentController = require("../controller/commentController");
const userController = require("../controller/userController");

router.post('/signup', authController.signup);
router.post('/verify', authController.verify);
router.get('/login/success', authController.loginSuccess);
router.get('/login/failed', authController.loginFailed);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);
router.get('/logout', authController.logout);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);
router.put('/user/update/:id', userController.updateUser);
router.delete('/user/delete/:id', userController.deleteUserById);
router.post("/comment/create", commentController.createComment);
router.put('/comment/update/:id', commentController.updateComment);
router.delete('/comment/delete/:id', commentController.deleteComment);

module.exports = router;
