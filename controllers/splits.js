const { newSplit, fetchSavedSplits, fetchSavedSplit, removeSavedSplit, share, fetchSharedSplits, fetchSharedSplit, removeSharedSplit } = require('../models/splits')
const fs = require('fs/promises');
const { generateId } = require('../util/nodemailer')


const createSplit = async (req, res) => {
    try {
        const id = `${generateId()}`
        const result = await newSplit(req.userDetails.email, req.userDetails.userId, req.body, id);
        if (!result) {
            throw "notfound";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getSavedSplits = async (req, res) => {
    try {
        const result = await fetchSavedSplits(req.userDetails.email, req.userDetails.userId);
        if (result === null) {
            throw "notfound";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getSharedSplits = async (req, res) => {
    try {
        const result = await fetchSharedSplits(req.userDetails.email, req.userDetails.userId);
        if (result === null) {
            throw "notfound";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getSavedSplit = async (req, res) => {
    try {
        const result = await fetchSavedSplit(req.userDetails.email, req.userDetails.userId, req.body.splitId);
        if (result === null) {
            throw "notfound";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getSharedSplit = async (req, res) => {
    try {
        const result = await fetchSharedSplit(req.userDetails.email, req.userDetails.userId, req.body.splitId);
        if (result === null) {
            throw "notfound";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}


const deleteSavedSplit = async (req, res) => {
    try {
        const result = await removeSavedSplit(req.userDetails.email, req.userDetails.userId, req.body.splitId);
        if (result === null) {
            throw "notfound";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const deleteSharedSplit = async (req, res) => {
    try {
        const result = await removeSharedSplit(req.userDetails.email, req.userDetails.userId, req.body.splitId);
        if (result === null) {
            throw "notfound";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const shareSplit = async (req, res) => {
    try {
        const result = await share(req.userDetails.email, req.userDetails.userId, req.body.splitId, req.body.friends);
        if (result === null) {
            throw "notfound";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

exports.createSplit = createSplit;
exports.getSavedSplits = getSavedSplits;
exports.getSavedSplit = getSavedSplit;
exports.deleteSavedSplit = deleteSavedSplit;
exports.shareSplit = shareSplit;
exports.getSharedSplits = getSharedSplits;
exports.getSharedSplit = getSharedSplit;
exports.deleteSharedSplit = deleteSharedSplit;


