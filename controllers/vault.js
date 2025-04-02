const { t3UploadToCloudinary, t2UploadToCloudinary, deleteFolderInCloudinary } = require('../util/cloudinary')
const { generateId } = require('../util/nodemailer')
const { addReceipt, fetchTags, deleteTag, appendTag, addWarranty, fetchReceipts, fetchDocs,
    fetchReceipt, removeReceipt, fetchWarranties, fetchWarranty, removeWarranty, changeExp,
    addDoc, fetchDoc, removeDoc, renameTag } = require('../models/vault')
const fs = require('fs/promises');

const parentFolderName = process.env.CLOUDINARY_PARENT_FOLDER;

const imagePreview = async (req, res) => {
    try {
        console.log(req.file);
        const filename = req.file.path;
        const name = req.params.par1;
        const result = await t2UploadToCloudinary(filename, `${req.userDetails.userId}vaultImagePreview${name}`, `${parentFolderName}/temp/${req.userDetails.userId}`, req.file.mimetype);
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

const getDocs = async (req, res) => {
    try {
        const result = await fetchDocs(req.userDetails.email, req.userDetails.userId);
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

const getDoc = async (req, res) => {
    try {
        const result = await fetchDoc(req.userDetails.email, req.userDetails.userId, req.body.docId);
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
        const response = await deleteFolderInCloudinary(`${parentFolderName}/users/${req.userDetails.userId}/vault/receipts/${req.body.recId}`);
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

const deleteDoc = async (req, res) => {
    try {
        const response = await deleteFolderInCloudinary(`${parentFolderName}/users/${req.userDetails.userId}/vault/docs/${req.body.docId}`);
        if (!response) {
            throw "failed";
        }
        const result = await removeDoc(req.userDetails.email, req.userDetails.userId, req.body.docId);
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
        const response = await deleteFolderInCloudinary(`${parentFolderName}/users/${req.userDetails.userId}/vault/warranties/${req.body.warId}`);
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
        const result = await deleteTag(req.userDetails.email, req.userDetails.userId, req.body.value, req.body.type);
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
        const result = await appendTag(req.userDetails.email, req.userDetails.userId, req.body.value.trim(), req.body.type);
        if (result !== true) {
            res.status(500).json({ error: result });
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
}

const editTag = async (req, res) => {
    try {
        const result = await renameTag(req.userDetails.email, req.userDetails.userId, req.body.preVal.trim(), req.body.newVal.trim(), req.body.type);
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
        const result = await t3UploadToCloudinary(req.body.files, `${parentFolderName}/users/${req.userDetails.userId}/vault/receipts/${id}`);
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
        const result = await t3UploadToCloudinary(req.body.files, `${parentFolderName}/users/${req.userDetails.userId}/vault/warranties/${id}`);
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

const createDoc = async (req, res) => {
    try {
        console.log(req.body);
        const id = generateId();
        const result = await t3UploadToCloudinary(req.body.files, `${parentFolderName}/users/${req.userDetails.userId}/vault/docs/${id}`);
        if (!result) {
            throw "uploadFailed";
        }
        const doc = {
            docId: id,
            details: req.body.details,
            files: result,
            tags: req.body.tags
        }
        const reponse = await addDoc(req.userDetails.email, req.userDetails.userId, doc);
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
exports.getDocs = getDocs;
exports.getWarranty = getWarranty;
exports.renewWarranty = renewWarranty;
exports.getReceipt = getReceipt;
exports.deleteReceipt = deleteReceipt;
exports.deleteWarranty = deleteWarranty;
exports.deleteTags = deleteTags;
exports.addTags = addTags;
exports.createDoc = createDoc;
exports.getDoc = getDoc;
exports.deleteDoc = deleteDoc;
exports.editTag = editTag;







