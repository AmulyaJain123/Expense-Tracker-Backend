const express = require('express');
const router = express.Router();
const { getAllNotifications } = require('../controllers/notifications');

router.get('/getAllNotifications', getAllNotifications);








exports.notificationsRouter = router