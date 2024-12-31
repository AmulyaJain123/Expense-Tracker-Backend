const { getProfile, editUpi, editProfilePic, fetchPublicProfile, editQrCode } = require('../models/profile')
const { changeUsername: overwriteUsername } = require('../models/user')
const { uploadToCloudinary, t1UploadToCloudinary } = require('../util/cloudinary')
const fs = require('fs/promises');
const { root } = require('../util/path')
const path = require('path')
const { detectAndCropQRCode } = require('../util/qrCrop')
const { getCountOfSplits } = require('../models/splits');
const { getCountOfVault } = require('../models/vault');
const { getCountOfTransactions } = require('../models/track');
const { getCountOfFriends } = require('../models/friends');
const { getUserByUserId } = require('../models/user');




const getMyProfile = async (req, res) => {
    try {
        const result = await getProfile(req.userDetails.email);
        const splits = await getCountOfSplits(req.userDetails.email, req.userDetails.userId);
        const friends = await getCountOfFriends(req.userDetails.email, req.userDetails.userId);
        const vault = await getCountOfVault(req.userDetails.email, req.userDetails.userId);
        const transactions = await getCountOfTransactions(req.userDetails.email, req.userDetails.userId);

        if (!result || splits === null || friends === null || vault === null || transactions === null) {
            throw "notfound";
        }
        res.status(200).json({ profile: result, splits, friends, transactions, vault });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getPublicProfile = async (req, res) => {
    try {
        const result = await fetchPublicProfile(req.body.userId);
        const user = await getUserByUserId(req.body.userId);
        if (!user) {
            throw "usernotfound";
        }
        console.log(user);
        const splits = await getCountOfSplits(user.email, user.userId);
        const friends = await getCountOfFriends(user.email, user.userId);
        const vault = await getCountOfVault(user.email, user.userId);
        const transactions = await getCountOfTransactions(user.email, user.userId);
        if (!result || splits === null || friends === null || vault === null || transactions === null) {
            throw "notfound";
        }
        res.status(200).json({ profile: result, splits, friends, transactions, vault });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const changeUsername = async (req, res) => {
    try {
        const newUsername = req.body.username;
        if (newUsername === "" || newUsername.length > 20) {
            throw "invalid";
        }
        const result = await overwriteUsername(req.userDetails.email, newUsername);
        if (!result) {
            throw "notfound";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const changeUpi = async (req, res) => {
    try {
        const newUpi = req.body.upiId;
        const result = await editUpi(req.userDetails.email, newUpi);
        if (!result) {
            throw "notfound";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}


const profilePicUpload = async (req, res) => {
    try {
        console.log(req.file);
        const filename = req.file.path;
        const result = await t1UploadToCloudinary(filename, `${req.userDetails.userId}profilePic`, '500', '500', `users/${req.userDetails.userId}/profile`);
        await fs.rm(req.file.path);
        if (!result) {
            throw "failed";
        }
        const res2 = await editProfilePic(req.userDetails.email, result);
        if (!res2) {
            throw "failed";
        }
        res.status(200).json({ url: result });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const profilePicPreview = async (req, res) => {
    try {
        console.log(req.file);
        const filename = req.file.path;
        const result = await t1UploadToCloudinary(filename, `${req.userDetails.userId}profilePicPreview`, '500', '500', `temp/${req.userDetails.userId}`);
        await fs.rm(req.file.path);
        if (!result) {
            throw "failed";
        }
        res.status(200).json({ url: result });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const qrCodeUpload = async (req, res) => {
    try {
        console.log(req.file);
        const filename = req.file.path;
        const newFileName = path.join(root, 'buffers', 'cropped' + req.file.filename);
        const croppingRes = await detectAndCropQRCode(filename, newFileName);
        if (!croppingRes) {
            await fs.rm(req.file.path);
            await fs.rm(newFileName);
            throw "cropunsuccessful";
        }
        const result = await t1UploadToCloudinary(newFileName, `${req.userDetails.userId}qrCode`, '500', '500', `users/${req.userDetails.userId}/profile`);
        await fs.rm(req.file.path);
        await fs.rm(newFileName);
        if (!result) {
            throw "failed";
        }
        const res2 = await editQrCode(req.userDetails.email, result);
        if (!res2) {
            throw "failed";
        }
        res.status(200).json({ url: result });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const qrCodePreview = async (req, res) => {
    try {
        console.log(req.file);
        const filename = req.file.path;
        const newFileName = path.join(root, 'buffers', 'cropped' + req.file.filename);
        const croppingRes = await detectAndCropQRCode(filename, newFileName);
        if (!croppingRes) {
            await fs.rm(req.file.path);
            await fs.rm(newFileName);
            throw "cropunsuccessful";
        }
        const result = await t1UploadToCloudinary(newFileName, `${req.userDetails.userId}qrCode`, '500', '500', `temp/${req.userDetails.userId}`);
        await fs.rm(req.file.path);
        await fs.rm(newFileName);
        if (!result) {
            throw "failed";
        }
        res.status(200).json({ url: result });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

exports.getMyProfile = getMyProfile;
exports.changeUsername = changeUsername;
exports.changeUpi = changeUpi;
exports.profilePicUpload = profilePicUpload;
exports.profilePicPreview = profilePicPreview;
exports.getPublicProfile = getPublicProfile;
exports.qrCodePreview = qrCodePreview;
exports.qrCodeUpload = qrCodeUpload;



