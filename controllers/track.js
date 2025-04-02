const { fetchCategories, appendCategory, removeCategory, addTransaction, fetchTransactions, fetchTransaction,
    removeTransaction, fetchTags, appendTag, removeTag, renameTag, renameSubCat, renameCat } = require('../models/track')
const fs = require('fs/promises');
const { dummyData } = require('../util/dummy')
const { generateId } = require('../util/nodemailer')
const { generateColors, generateTagColors } = require('../util/colors')


const getCategories = async (req, res) => {
    try {
        const result = await fetchCategories(req.userDetails.email, req.userDetails.userId);
        if (!result) {
            throw "notfound";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getCategoriesNTags = async (req, res) => {
    try {
        const result = await fetchCategories(req.userDetails.email, req.userDetails.userId);
        if (!result) {
            throw "notfound";
        }
        const result2 = await fetchTags(req.userDetails.email, req.userDetails.userId);
        res.status(200).json({ ...result, tags: result2 });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getTransactions = async (req, res) => {
    try {
        const result = await fetchTransactions(req.userDetails.email, req.userDetails.userId);
        if (!result) {
            throw "notfound";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getTransactionsNCategories = async (req, res) => {
    try {
        const result = await fetchCategories(req.userDetails.email, req.userDetails.userId);
        const result2 = await fetchTransactions(req.userDetails.email, req.userDetails.userId);
        const result3 = await fetchTags(req.userDetails.email, req.userDetails.userId);

        if (!result || !result2) {
            throw "notfound";
        }
        res.status(200).json({ transactions: result2, categories: result, tags: result3 });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getDashboardData = async (req, res) => {
    try {
        const result = await fetchCategories(req.userDetails.email, req.userDetails.userId);
        const result2 = await fetchTransactions(req.userDetails.email, req.userDetails.userId);
        const result3 = await fetchTags(req.userDetails.email, req.userDetails.userId);
        if (!result || !result2) {
            throw "notfound";
        }
        const colors = generateColors(result);
        const tagColors = generateTagColors(result3);

        res.status(200).json({ transactions: result2, categories: result, tags: result3, colors: colors, tagColors: tagColors });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getTransaction = async (req, res) => {
    try {
        const result2 = await fetchTransaction(req.userDetails.email, req.userDetails.userId, req.body.transactionId);
        if (!result2) {
            throw "notfound";
        }
        res.status(200).json(result2);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const addCategory = async (req, res) => {
    try {
        const { value, path } = req.body;
        const result = await appendCategory(req.userDetails.email, req.userDetails.userId, value, path);
        if (!result) {
            throw "notfound";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { value } = req.body;
        const result = await removeCategory(req.userDetails.email, req.userDetails.userId, value);
        if (!result) {
            throw "notfound";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const { value } = req.body;
        const result = await removeTransaction(req.userDetails.email, req.userDetails.userId, req.body.transactionId);
        if (!result) {
            throw "notfound";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const createTransaction = async (req, res) => {
    try {
        const obj = JSON.parse(JSON.stringify(req.body));
        obj.transactionId = `${generateId()}`;
        const result = await addTransaction(req.userDetails.email, req.userDetails.userId, obj);

        if (!result) {
            throw "notfound";
        }
        // for (let i of dummyData) {
        //     const result = await addTransaction(req.userDetails.email, req.userDetails.userId, i);
        //     if (!result) {
        //         throw "notfound";
        //     }
        // }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const addTags = async (req, res) => {
    try {
        if (RegExp(/\b\d+ others\b/i).test(req.body.value.trim())) {
            return res.status(500).json({ error: 'Tag Forbidden' });
        }
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

const getTags = async (req, res) => {
    try {
        const result = await fetchTags(req.userDetails.email, req.userDetails.userId);
        if (result === null) {
            throw 'failed';
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const deleteTag = async (req, res) => {
    try {
        const result = await removeTag(req.userDetails.email, req.userDetails.userId, req.body.value);
        if (!result) {
            throw "failed";
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const editTag = async (req, res) => {
    try {
        if (RegExp(/\b\d+ others\b/i).test(req.body.newVal.trim())) {
            return res.status(500).json({ error: 'Tag Forbidden' });
        }
        const result = await renameTag(req.userDetails.email, req.userDetails.userId, req.body.preVal.trim(), req.body.newVal.trim());
        if (result !== true) {
            res.status(500).json({ error: result });
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
}

const editSubCat = async (req, res) => {
    try {
        const result = await renameSubCat(req.userDetails.email, req.userDetails.userId, req.body.preVal, req.body.newVal);
        if (result !== true) {
            res.status(500).json({ error: result });
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
}

const editCat = async (req, res) => {
    try {
        const result = await renameCat(req.userDetails.email, req.userDetails.userId, req.body.preVal, req.body.newVal);
        if (result !== true) {
            res.status(500).json({ error: result });
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
}





exports.getCategories = getCategories;
exports.addCategory = addCategory;
exports.deleteCategory = deleteCategory;
exports.createTransaction = createTransaction;
exports.getTransactions = getTransactions;
exports.getTransactionsNCategories = getTransactionsNCategories;
exports.getTransaction = getTransaction;
exports.deleteTransaction = deleteTransaction;
exports.getDashboardData = getDashboardData;
exports.getCategoriesNTags = getCategoriesNTags;
exports.addTags = addTags;
exports.getTags = getTags;
exports.deleteTag = deleteTag;
exports.editTag = editTag;
exports.editSubCat = editSubCat;
exports.editCat = editCat;

