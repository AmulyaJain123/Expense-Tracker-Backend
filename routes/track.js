const express = require('express');
const router = express.Router();
const { getCategories, addCategory, deleteCategory, createTransaction, getTransactions, getTransactionsNCategories, getTransaction, deleteTransaction, getDashboardData } = require('../controllers/track');


router.get('/getcategories', getCategories);

router.get('/gettransactions', getTransactions);

router.post('/gettransaction', getTransaction);

router.get('/gettransactionsncategories', getTransactionsNCategories);

router.get('/getdashboarddata', getDashboardData);

router.post('/addcategory', addCategory);

router.post('/deletecategory', deleteCategory);

router.post('/deletetransaction', deleteTransaction);

router.post('/createtransaction', createTransaction);





exports.trackRouter = router