const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const commentController = require("../controller/commentController");
const userController = require("../controller/userController");
const articleController = require('../controller/articleContoller');
const doctorController = require('../controller/doctorController');
const upload = require('../middleware/upload'); // Import middleware multer


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
router.put('/user/update/:id', upload.single('avatar'), userController.updateUser); // Tambahkan middleware multer untuk unggahan file
router.delete('/delete/:id', userController.deleteUserById);
router.post("/comment/create", commentController.createComment);
router.put('/comment/update/:id', commentController.updateComment);
router.delete('/comment/delete/:id', commentController.deleteComment);
router.post('/article/create', articleController.createArticle);
router.get('/article', articleController.getArticles);
router.get('/article/search', articleController.searchArticleByTitle);
router.post('/doctor/create', doctorController.createDoctor);
router.get('/doctor/all', doctorController.getAll);
router.get('/doctor', doctorController.getDoctors);



module.exports = router;
