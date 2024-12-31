const { fetchCategories, appendCategory, removeCategory, addTransaction, fetchTransactions, fetchTransaction, removeTransaction } = require('../models/track')
const fs = require('fs/promises');
const { dummyData } = require('../util/dummy')
const { generateId } = require('../util/nodemailer')
const { generateColors } = require('../util/colors')


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
        if (!result || !result2) {
            throw "notfound";
        }
        res.status(200).json({ transactions: result2, categories: result });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const getDashboardData = async (req, res) => {
    try {
        const result = await fetchCategories(req.userDetails.email, req.userDetails.userId);
        const result2 = await fetchTransactions(req.userDetails.email, req.userDetails.userId);
        if (!result || !result2) {
            throw "notfound";
        }
        const colors = generateColors(result);
        res.status(200).json({ transactions: result2, categories: result, colors: colors });
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





exports.getCategories = getCategories;
exports.addCategory = addCategory;
exports.deleteCategory = deleteCategory;
exports.createTransaction = createTransaction;
exports.getTransactions = getTransactions;
exports.getTransactionsNCategories = getTransactionsNCategories;
exports.getTransaction = getTransaction;
exports.deleteTransaction = deleteTransaction;
exports.getDashboardData = getDashboardData;


