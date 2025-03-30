const express = require('express');
const router = express.Router();
const { imagePreview, createReceipt, getTags, deleteTags, addTags, createWarranty, getReceipts, getReceipt, deleteReceipt, getWarranties, getWarranty, deleteWarranty, renewWarranty, createDoc, getDocs, getDoc, deleteDoc } = require('../controllers/vault');
const { upload } = require('../util/multer');

router.post('/imagepreview/:par1', upload.single('billImg'), imagePreview);

router.post('/createreceipt', createReceipt);

router.post('/createwarranty', createWarranty);

router.post('/createdoc', createDoc);

router.get('/gettags', getTags);

router.get('/getreceipts', getReceipts);

router.get('/getwarranties', getWarranties);

router.get('/getdocs', getDocs);

router.post('/getdoc', getDoc);

router.post('/getwarranty', getWarranty);

router.post('/renewwarranty', renewWarranty);

router.post('/getreceipt', getReceipt);

router.post('/deletereceipt', deleteReceipt);

router.post('/deletewarranty', deleteWarranty);

router.post('/deletedoc', deleteDoc);

router.post('/deletetag', deleteTags);

router.post('/addtag', addTags);







exports.vaultRouter = router