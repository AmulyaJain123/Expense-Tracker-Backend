const express = require('express');
const router = express.Router();
const { getChats, newChat } = require('../controllers/message');

router.get('/getchats', getChats);

router.post('/newchat', newChat);




exports.messageRouter = router