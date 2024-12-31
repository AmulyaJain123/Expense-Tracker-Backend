const mongoose = require('mongoose');

const { addProfile, editUsername } = require('../models/profile')

const userSchema = mongoose.Schema({
    username: {
        type: 'String',
    },
    email: {
        type: 'String',
    },
    password: {
        type: 'String'
    },
    userId: {
        type: 'String'
    },
})

async function findUserByEmail(email) {
    const res = await User.exists({ email: email });
    if (res) {
        const doc = await User.findOne({ email: email });
        return doc;
    }
    return null;
}

async function findUserByUsername(username) {
    const res = await User.exists({ username: username });
    if (res) {
        const doc = await User.findById(res);
        return doc;
    }
    return null;
}

async function addUser(email, password, username, userId) {
    try {
        const newUser = new User({ email: email, password: password, username: username, userId: userId });
        await newUser.save();
        await addProfile(email, username, userId);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function changePass(email, password) {
    try {
        const doc = await User.exists({ email: email });
        if (doc) {
            const res = await User.updateOne({ email: email }, { $set: { password: password } })
        } else {
            return "notfound";
        }
        return "success";
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function allUsers() {
    try {
        const res = await User.find();
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function editUser(email, username, bio, profilePic) {
    try {
        const result = await User.updateOne(
            { email: email },
            {
                $set: {
                    username: username,
                    bio: bio,
                    profilePic: profilePic
                }
            }
        )
        return true;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

async function changeUsername(email, username) {
    try {
        const res = await User.exists({ email: email });
        if (!res) {
            throw "notfound";
        }
        const res2 = await editUsername(email, username);
        if (!res2) {
            throw "failed";
        }
        const result = await User.updateOne({ email: email }, { $set: { username: username } });
        if (!result) {
            throw "failed";
        }
        return true;

    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getUserByUserId(userId) {
    try {
        const user = await User.findOne({ userId: userId });
        if (!user) {
            throw "notfound";
        }
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const User = mongoose.model('User', userSchema);


exports.userModel = User;
exports.findUserByEmail = findUserByEmail;
exports.findUserByUsername = findUserByUsername;
exports.addUser = addUser;
exports.allUsers = allUsers;
exports.editUser = editUser;
exports.getUserByEmail = getUserByEmail;
exports.changePass = changePass;
exports.changeUsername = changeUsername;
exports.getUserByUserId = getUserByUserId;



