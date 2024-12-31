const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    email: {
        type: 'String',
    },
    otp: {
        type: 'Number'
    },
})

async function storeOtp(email, otp) {
    try {
        const doc = await Otp.exists({ email: email });
        if (doc) {
            await Otp.updateOne({ email: email }, { $set: { otp: otp } });
        } else {
            const newEntry = new Otp({ email: email, otp: otp });
            await newEntry.save()
        }
        return '200';
    } catch (err) {
        console.log(err);
        return '500';
    }
}

async function verifyOtp(email, otp) {
    try {
        const doc = await Otp.findOne({ email: email });
        if (doc && doc.otp == otp) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return '500';
    }
}

const Otp = mongoose.model('Otp', otpSchema);


exports.otpModel = Otp;
exports.storeOtp = storeOtp;
exports.verifyOtp = verifyOtp;



