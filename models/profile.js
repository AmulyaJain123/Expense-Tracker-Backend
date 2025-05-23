const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    email: {
        type: 'String',
    },
    username: {
        type: 'String'
    },
    userId: {
        type: 'String'
    },
    joinedOn: {
        type: 'String'
    },
    fullname: {
        type: 'String'
    },
    upiId: {
        type: 'String',
        default: null
    },
    qrCode: {
        type: 'String',
        default: null
    },
    profilePic: {
        type: 'String',
        default: null
    },
    activity: {
        type: ['String'],
        default: []
    },
})

async function addProfile(email, username, userId, fullname) {
    try {
        const currDate = new Date().toISOString();
        const doc = new Profile({ email, username, userId, joinedOn: currDate, fullname: fullname });
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getProfile(email) {
    try {
        const doc = await Profile.findOne({ email: email });
        if (!doc) {
            throw "notfound";
        }
        return doc;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getProfileByuserId(userId) {
    try {
        const doc = await Profile.findOne({ userId: userId });
        if (!doc) {
            throw "notfound";
        }
        return doc;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getProfileById(id) {
    try {
        const doc = await Profile.findOne({ _id: id });
        if (!doc) {
            throw "notfound";
        }
        return doc;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchPublicProfile(userID) {
    try {
        const doc = await Profile.findOne({ userId: userID });
        if (!doc) {
            throw "notfound";
        }
        console.log(doc);
        const { userId, username, joinedOn, upiId, qrCode, profilePic, activity, fullname } = doc;
        const obj = { userId, username, joinedOn, upiId, qrCode, profilePic, activity, fullname }
        console.log(obj);
        return obj;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function editFullname(email, fullname) {
    try {
        const res2 = await Profile.updateOne({ email: email }, { $set: { fullname: fullname } });
        if (!res2) {
            throw "failed";
        }
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function editUpi(email, upiId) {
    try {
        let newUpi = upiId.trim() === "" ? null : upiId;
        const res2 = await Profile.updateOne({ email: email }, { $set: { upiId: newUpi } });
        if (!res2) {
            throw "failed";
        }
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function editProfilePic(email, url) {
    try {
        const doc = await Profile.findOne({ email: email });
        if (!doc) {
            throw "notfound";
        }
        doc.profilePic = url;
        const res = await doc.save();
        if (!res) {
            throw "savefailed";
        }
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function editQrCode(email, url) {
    try {
        const doc = await Profile.findOne({ email: email });
        if (!doc) {
            throw "notfound";
        }
        doc.qrCode = url;
        const res = await doc.save();
        if (!res) {
            throw "savefailed";
        }
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function pushActivity(email, value) {
    try {
        const doc = await Profile.findOne({ email: email });
        if (!doc) {
            throw "notfound"
        }
        doc.activity.push(value);
        const res = await doc.save();
        if (!res) {
            throw "savefailed";
        }
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}



const Profile = mongoose.model('Profile', profileSchema);


exports.profileModel = Profile;
exports.profileSchema = profileSchema;
exports.addProfile = addProfile;
exports.getProfile = getProfile;
exports.editFullname = editFullname;
exports.editUpi = editUpi;
exports.editProfilePic = editProfilePic;
exports.pushActivity = pushActivity;
exports.fetchPublicProfile = fetchPublicProfile;
exports.getProfileByuserId = getProfileByuserId;
exports.editQrCode = editQrCode;
exports.getProfileById = getProfileById;








