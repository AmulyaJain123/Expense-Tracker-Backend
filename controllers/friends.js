const { getFriends, getQueryResults, createNewRequest, fetchSentRequests, fetchRecievedRequests, closeFriendRequest, deleteFriend } = require('../models/friends')
const { sendFriendRequestRecievedNotification, sendRemoveFriendNotification, sendCloseRequestNotification } = require('./notifications')

const fs = require('fs/promises');


const getFriendsDetails = async (req, res) => {
    try {
        const result = await getFriends(req.userDetails.email, req.userDetails.userId);
        if (result === null) {
            throw "notfound";
        }
        result.reverse();
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getSearchResults = async (req, res) => {
    try {
        const result = await getQueryResults(req.userDetails.email, req.userDetails.userId, req.body.value);
        if (result === null) {
            throw "notfound";
        }
        console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const sendFriendRequest = async (req, res) => {
    try {
        const result = await createNewRequest(req.userDetails.email, req.userDetails.userId, req.body.email, req.body.userId);
        if (result === null) {
            throw "notfound";
        }
        if (result) {
            const result2 = await sendFriendRequestRecievedNotification(req.userDetails.email, req.userDetails.userId, req.body.email, req.body.userId);
        }
        console.log(result);
        res.status(200).json(result ? 'sent' : 'recieved');
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getSentRequest = async (req, res) => {
    try {
        const result = await fetchSentRequests(req.userDetails.email, req.userDetails.userId);
        if (result === null) {
            throw "notfound";
        }
        result.reverse();
        console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}


const getRecievedRequest = async (req, res) => {
    try {
        const result = await fetchRecievedRequests(req.userDetails.email, req.userDetails.userId);
        if (result === null) {
            throw "notfound";
        }
        result.reverse();
        console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const closeRequest = async (req, res) => {
    try {
        const result = await closeFriendRequest(req.body.email, req.body.userId, req.userDetails.email, req.userDetails.userId, req.body.val);
        if (result === null) {
            throw "notfound";
        }
        const result2 = await sendCloseRequestNotification(req.userDetails.email, req.userDetails.userId, req.body.email, req.body.userId, req.body.val);
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const removeFriend = async (req, res) => {
    try {
        const result = await deleteFriend(req.userDetails.email, req.userDetails.userId, req.body.email, req.body.userId);
        if (result === null) {
            throw "notfound";
        }
        const result2 = await sendRemoveFriendNotification(req.userDetails.email, req.userDetails.userId, req.body.email, req.body.userId);
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

exports.getFriendsDetails = getFriendsDetails;
exports.getSearchResults = getSearchResults;
exports.sendFriendRequest = sendFriendRequest;
exports.getSentRequest = getSentRequest;
exports.getRecievedRequest = getRecievedRequest;
exports.closeRequest = closeRequest;
exports.removeFriend = removeFriend;



