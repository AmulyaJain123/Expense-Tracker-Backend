const express = require('express');
const router = express.Router();
const { imagePreview, createReceipt, getTags, deleteTags, addTags, createWarranty, getReceipts, getReceipt, deleteReceipt, getWarranties, getWarranty, deleteWarranty, renewWarranty } = require('../controllers/vault');
const { upload } = require('../util/multer');

router.post('/imagepreview/:par1', upload.single('billImg'), imagePreview);

router.post('/createreceipt', createReceipt);

router.post('/createwarranty', createWarranty);

router.get('/gettags', getTags);

router.get('/getreceipts', getReceipts);

router.get('/getwarranties', getWarranties);

router.post('/getwarranty', getWarranty);

router.post('/renewwarranty', renewWarranty);

router.post('/getreceipt', getReceipt);

router.post('/deletereceipt', deleteReceipt);

router.post('/deletewarranty', deleteWarranty);

router.post('/deletetag', deleteTags);

router.post('/addtag', addTags);







exports.vaultRouter = router