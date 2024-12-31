const express = require('express');
const router = express.Router();
const { getFriendsDetails, getSearchResults, sendFriendRequest, getSentRequest, getRecievedRequest, closeRequest, removeFriend } = require('../controllers/friends');

router.get('/getdetails', getFriendsDetails);

router.post('/getpeople', getSearchResults);

router.post('/sendrequest', sendFriendRequest);

router.get('/getsentrequests', getSentRequest);

router.get('/getrecievedrequests', getRecievedRequest);

router.post('/closerequest', closeRequest);

router.post('/removeFriend', removeFriend);







exports.friendsRouter = router