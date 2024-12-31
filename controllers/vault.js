const { t3UploadToCloudinary, t2UploadToCloudinary, deleteFolderInCloudinary } = require('../util/cloudinary')
const { generateId } = require('../util/nodemailer')
const { addReceipt, fetchTags, deleteTag, appendTag, addWarranty, fetchReceipts, fetchReceipt, removeReceipt, fetchWarranties, fetchWarranty, removeWarranty, changeExp } = require('../models/vault')
const fs = require('fs/promises');

const imagePreview = async (req, res) => {
    try {
        console.log(req.file);
        const filename = req.file.path;
        const name = req.params.par1;
        const result = await t2UploadToCloudinary(filename, `${req.userDetails.userId}vaultImagePreview${name}`, `temp/${req.userDetails.userId}`, req.file.mimetype);
        await fs.rm(req.file.path);
        if (!result) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getTags = async (req, res) => {
    try {
        const result = await fetchTags(req.userDetails.email, req.userDetails.userId);
        if (!result) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getReceipts = async (req, res) => {
    try {
        const result = await fetchReceipts(req.userDetails.email, req.userDetails.userId);
        if (!result) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getWarranties = async (req, res) => {
    try {
        const result = await fetchWarranties(req.userDetails.email, req.userDetails.userId);
        if (!result) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getWarranty = async (req, res) => {
    try {
        const result = await fetchWarranty(req.userDetails.email, req.userDetails.userId, req.body.warId);
        if (!result) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const renewWarranty = async (req, res) => {
    try {
        const result = await changeExp(req.userDetails.email, req.userDetails.userId, req.body.warId, req.body.renewedOn, req.body.newExpDate);
        if (!result) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getReceipt = async (req, res) => {
    try {
        const result = await fetchReceipt(req.userDetails.email, req.userDetails.userId, req.body.recId);
        if (!result) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const deleteReceipt = async (req, res) => {
    try {
        const response = await deleteFolderInCloudinary(`users/${req.userDetails.userId}/vault/receipts/${req.body.recId}`);
        if (!response) {
            throw "failed";
        }
        const result = await removeReceipt(req.userDetails.email, req.userDetails.userId, req.body.recId);
        if (!result) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const deleteWarranty = async (req, res) => {
    try {
        const response = await deleteFolderInCloudinary(`users/${req.userDetails.userId}/vault/warranties/${req.body.warId}`);
        if (!response) {
            throw "failed";
        }
        const result = await removeWarranty(req.userDetails.email, req.userDetails.userId, req.body.warId);
        if (!result) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const deleteTags = async (req, res) => {
    try {
        const result = await deleteTag(req.userDetails.email, req.userDetails.userId, req.body.value);
        if (!result) {
            throw "failed";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const addTags = async (req, res) => {
    try {
        const result = await appendTag(req.userDetails.email, req.userDetails.userId, req.body.value.trim());
        if (result !== true) {
            res.status(500).json({ error: result });
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
}


const createReceipt = async (req, res) => {
    try {
        console.log(req.body);
        const id = generateId();
        const result = await t3UploadToCloudinary(req.body.files, `users/${req.userDetails.userId}/vault/receipts/${id}`);
        if (!result) {
            throw "uploadFailed";
        }
        const receipt = {
            recId: id,
            details: req.body.details,
            files: result,
            tags: req.body.tags
        }
        const reponse = await addReceipt(req.userDetails.email, req.userDetails.userId, receipt);
        if (!reponse) {
            throw "failed"
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const createWarranty = async (req, res) => {
    try {
        console.log(req.body);
        const id = generateId();
        const result = await t3UploadToCloudinary(req.body.files, `users/${req.userDetails.userId}/vault/warranties/${id}`);
        if (!result) {
            throw "uploadFailed";
        }
        const warranty = {
            warId: id,
            details: req.body.details,
            files: result,
            tags: req.body.tags
        }
        const reponse = await addWarranty(req.userDetails.email, req.userDetails.userId, warranty);
        if (!reponse) {
            throw "failed"
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}



exports.imagePreview = imagePreview;
exports.createReceipt = createReceipt;
exports.createWarranty = createWarranty;
exports.getTags = getTags;
exports.getReceipts = getReceipts;
exports.getWarranties = getWarranties;
exports.getWarranty = getWarranty;
exports.renewWarranty = renewWarranty;
exports.getReceipt = getReceipt;
exports.deleteReceipt = deleteReceipt;
exports.deleteWarranty = deleteWarranty;
exports.deleteTags = deleteTags;
exports.addTags = addTags;







