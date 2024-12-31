const express = require('express');
const router = express.Router();
const { createSplit, getSavedSplits, getSavedSplit, deleteSavedSplit, shareSplit, getSharedSplits, getSharedSplit, deleteSharedSplit } = require('../controllers/splits');


router.post('/createsplit', createSplit);

router.get('/getsavedsplits', getSavedSplits);

router.get('/getsharedsplits', getSharedSplits);

router.post('/getsavedsplit', getSavedSplit);

router.post('/getsharedsplit', getSharedSplit);

router.post('/deletesavedsplit', deleteSavedSplit);

router.post('/deletesharedsplit', deleteSharedSplit);

router.post('/share', shareSplit);




exports.splitsRouter = router