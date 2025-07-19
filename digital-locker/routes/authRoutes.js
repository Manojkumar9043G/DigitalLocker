const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { uploadFile } = require('../controllers/uploadFile'); // ✅ fix here
const { getDatas }= require('../controllers/getDatas');
const { openFile }= require('../controllers/uploadFile');
const verifyToken = require('../middleware/verifyToken');
const { deleteFile } = require('../controllers/uploadFile'); // ✅ fix here
const upload = require('../middleware/uplode');
const { renameFile } = require('../controllers/uploadFile'); // ✅ fix here
const { downloadFile } = require('../controllers/uploadFile'); // ✅ fix here

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/upload', verifyToken, upload.single('file'), uploadFile); // ✅ fixed usage
router.get('/files',verifyToken,getDatas)
router.get('/files/:id/view',openFile);
router.delete('/deleteFile/:id',verifyToken,deleteFile);
router.get('/api/files/:id/download', verifyToken, downloadFile);
router.put('/renameFile/:id', renameFile);


module.exports = router;