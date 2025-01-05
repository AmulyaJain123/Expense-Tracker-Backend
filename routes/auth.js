const express = require('express');
const router = express.Router();
const { getOtp, checkOtp, resendOtp, createAccount, signIn, resetGetOtp, resetResendOtp, resetCheckOtp, changePassword, getDetails } = require('../controllers/auth');

router.post('/signup/getotp', getOtp)

router.post('/signup/verifyotp', checkOtp)

router.post('/signup/resendotp', resendOtp)

router.post('/signup/createaccount', createAccount)

router.post('/signin/verifydetails', signIn)

router.post('/reset/getotp', resetGetOtp)

router.post('/reset/resendotp', resetResendOtp)

router.post('/reset/verifyotp', resetCheckOtp)

router.post('/reset/changepassword', changePassword)

router.get('/getdetails', getDetails)






exports.authRouter = router