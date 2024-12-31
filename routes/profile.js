const express = require('express');
const router = express.Router();
const { changeUsername, getMyProfile, changeUpi, profilePicUpload, profilePicPreview, getPublicProfile, qrCodeUpload, qrCodePreview } = require('../controllers/profile');
const { upload } = require('../util/multer');

router.get('/myprofile', getMyProfile);

router.post('/viewprofile', getPublicProfile);

router.post('/changeusername', changeUsername);

router.post('/changeupi', changeUpi);

router.post('/profilepicupload', upload.single('profilePic'), profilePicUpload);

router.post('/profilepicpreview', upload.single('profilePic'), profilePicPreview);

router.post('/qrcodeupload', upload.single('qrCode'), qrCodeUpload);

router.post('/qrcodepreview', upload.single('qrCode'), qrCodePreview);







exports.profileRouter = router