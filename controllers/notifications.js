const { newNotification, fetchNotifications } = require('../models/notifications')
const { getProfile, getProfileByuserId } = require('../models/profile')
const { fetchSavedSplit } = require('../models/splits')



const fs = require('fs/promises');


const sendFriendRequestRecievedNotification = async (sendEmail, sendUId, recEmail, recUId) => {
    try {
        const user = await getProfile(sendEmail);
        const notification = { message: `@${user.username} send you a friend request.`, topic: 'friendRequestRecieved', recieveDate: new Date().toUTCString(), data: { username: user.username, profilePic: user.profilePic, userId: user.userId, fullname: user.fullname } };
        const result = await newNotification(recEmail, recUId, notification);
        if (!result) {
            throw "notfound";
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const sendLoginAttemptNotification = async (email, userId, time) => {
    try {
        const notification = { message: `A Login Attempt with your email was made at ${time}.`, topic: 'loginActivityDetected', recieveDate: new Date().toUTCString(), data: { timestamp: time } };
        const result = await newNotification(email, userId, notification);
        if (!result) {
            throw "notfound";
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const sendRemoveFriendNotification = async (sendEmail, sendUId, recEmail, recUId) => {
    try {
        const user = await getProfile(sendEmail);
        const notification = { message: `@${user.username} removed you from his friends.`, topic: 'friendRemoved', recieveDate: new Date().toUTCString(), data: { username: user.username, profilePic: user.profilePic, userId: user.userId, fullname: user.fullname } };
        const result = await newNotification(recEmail, recUId, notification);
        if (!result) {
            throw "notfound";
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const sendCloseRequestNotification = async (sendEmail, sendUId, recEmail, recUId, val) => {
    try {
        const user = await getProfile(sendEmail);
        const notification = { message: `@${user.username} ${val ? 'accepted' : 'rejected'} your request.`, topic: val ? 'friendRequestAccepted' : 'friendRequestRejected', recieveDate: new Date().toUTCString(), data: { username: user.username, profilePic: user.profilePic, userId: user.userId, fullname: user.fullname } };
        const result = await newNotification(recEmail, recUId, notification);
        if (!result) {
            throw "notfound";
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const sendSplitShareNotification = async (sendEmail, sendUId, recUId, splitId) => {
    try {
        const user = await getProfile(sendEmail);
        const user2 = await getProfileByuserId(recUId);
        const split = await fetchSavedSplit(sendEmail, sendUId, splitId);
        const notification = { message: `@${user.username} shared a split with you`, topic: 'splitShared', recieveDate: new Date().toUTCString(), data: { username: user.username, profilePic: user.profilePic, userId: user.userId, splitName: split.splitInfo.splitName, fullname: user.fullname } };
        const result = await newNotification(user2.email, user2.userId, notification);
        if (!result) {
            throw "notfound";
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const getAllNotifications = async (req, res) => {
    try {
        const result = await fetchNotifications(req.userDetails.email, req.userDetails.userId);
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

exports.sendFriendRequestRecievedNotification = sendFriendRequestRecievedNotification;
exports.getAllNotifications = getAllNotifications;
exports.sendRemoveFriendNotification = sendRemoveFriendNotification;
exports.sendCloseRequestNotification = sendCloseRequestNotification;
exports.sendSplitShareNotification = sendSplitShareNotification;
exports.sendLoginAttemptNotification = sendLoginAttemptNotification;



