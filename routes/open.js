const express = require('express');
const router = express.Router();
const { getSplit } = require('../controllers/open');

router.post('/getsplit', getSplit)







exports.openRouter = router