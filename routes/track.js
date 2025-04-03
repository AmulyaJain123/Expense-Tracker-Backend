const express = require('express');
const router = express.Router();
const { getCategories, getCategoriesNTags, addCategory, deleteCategory, createTransaction, getTransactions, getTransactionsNCategories,
    getTransaction, deleteTransaction, getDashboardData, addTags, getTags, deleteTag, editTag, editSubCat, editCat,
    getEditTransaction, addCategoryOnSpot, editTransaction } = require('../controllers/track');


router.get('/getcategories', getCategories);

router.get('/getcategoriesntags', getCategoriesNTags);

router.get('/gettransactions', getTransactions);

router.post('/gettransaction', getTransaction);

router.post('/gettransactionncatntags', getEditTransaction);

router.post('/addcategoryonspot', addCategoryOnSpot);

router.get('/gettransactionsncategories', getTransactionsNCategories);

router.get('/getdashboarddata', getDashboardData);

router.post('/addcategory', addCategory);

router.post('/deletecategory', deleteCategory);

router.post('/deletetransaction', deleteTransaction);

router.post('/createtransaction', createTransaction);

router.post('/edittransaction', editTransaction);

router.post('/addtag', addTags);

router.get('/gettags', getTags);

router.post('/deletetag', deleteTag);

router.post('/edittag', editTag);

router.post('/editsubcat', editSubCat);

router.post('/editcat', editCat);







exports.trackRouter = router