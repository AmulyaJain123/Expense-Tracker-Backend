const mongoose = require('mongoose');

const { profileModel, addProfile, editUsername } = require('../models/profile')
const { userModel } = require('../models/user')

const singleFriendSchema = mongoose.Schema({
    email: {
        type: 'String',
    },
    userId: {
        type: 'String'
    },
    date: {
        type: 'String'
    }
})

const requestSchema = mongoose.Schema({
    sender: {
        email: {
            type: 'String',
        },
        userId: {
            type: 'String'
        },
    },
    reciever: {
        email: {
            type: 'String',
        },
        userId: {
            type: 'String'
        },
    },
    sendDate: {
        type: 'String'
    },
    resolvedDate: {
        type: 'String',
        default: null
    },
    status: {
        type: 'String',
    }
})

const friendSchema = mongoose.Schema({
    email: {
        type: 'String',
    },
    userId: {
        type: 'String'
    },
    friends: {
        type: [singleFriendSchema],
        default: []
    },
    requestsSent: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Request'
        }],
        default: []
    },
    requestRecieved: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Request'
        }],
        default: []
    }
})


async function addEntry(email, userId) {
    try {
        const doc = new Friend({ email, userId });
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getCountOfFriends(email, userId) {
    try {
        const temp = await Friend.exists({ email: email });
        if (!temp) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Friend.findOne({ email: email });
        if (!doc) {
            throw "notfound";
        }
        return doc.friends.length;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getFriends(email, userId) {
    try {
        const temp = await Friend.exists({ email: email });
        if (!temp) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Friend.findOne({ email: email });
        if (!doc) {
            throw "notfound";
        }
        const ans = [];
        for (let i of doc.friends) {
            const Email = i.email;
            const doc2 = await profileModel.findOne({ email: Email });
            if (!doc2) {
                throw "friendnotfound";
            }
            const { email, userId, username, joinedOn, upiId, qrCode, profilePic, activity, friends } = doc2;
            const obj = { email, userId, username, joinedOn, upiId, qrCode, profilePic, activity, friends, friendsAt: i.date }
            ans.push(obj);
        }
        return ans;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getQueryResults(email, userId, query) {
    try {
        const temp = await Friend.exists({ email: email });
        if (!temp) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const user = await Friend.findOne({ email: email });
        if (!user) {
            throw "notfound";
        }
        const userIdOfFriends = user.friends.map((i) => i.userId);
        const res = await profileModel.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { userId: { $regex: query, $options: "i" } }
            ]
        });
        const mainEmail = email;
        let ans = res.filter((i) => i.email != email);
        for (let i = 0; i < ans.length; ++i) {
            const { email, userId, username, joinedOn, upiId, qrCode, profilePic, activity, friends } = ans[i];
            const obj = { email, userId, username, joinedOn, upiId, qrCode, profilePic, activity, friends };
            if (!userIdOfFriends.includes(ans[i].userId)) {
                obj.status = 'User';
                const temp = await Request.exists({ 'sender.email': mainEmail, 'reciever.email': email, status: 'sent' })
                if (temp) {
                    obj.waiting = 'sent';
                }
                const temp1 = await Request.exists({ 'reciever.email': mainEmail, 'sender.email': email, status: 'sent' })
                if (temp1) {
                    obj.waiting = 'recieved';
                }
            } else {
                obj.status = 'Friend'
            }
            ans[i] = obj;
        };
        console.log(ans);
        return ans;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function createNewRequest(email, userId, email2, userId2) {
    try {
        const temp1 = await userModel.exists({ email: email, userId: userId });
        const temp2 = await userModel.exists({ email: email2, userId: userId2 });
        console.log(email, userId, email2, userId2, temp1, temp2);
        if (!temp1 || !temp2) {
            throw "wronginfo";
        }
        const temp3 = await Friend.exists({ email: email });
        if (!temp3) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "user1CreationFailed";
            }
        }
        const temp4 = await Friend.exists({ email: email2 });
        if (!temp4) {
            const res = await addEntry(email2, userId2);
            if (!res) {
                throw "user2CreationFailed";
            }
        }
        const prevReq = await Request.exists({ "sender.email": email2, "reciever.email": email, status: 'sent' })
        if (prevReq) {
            return false;
        }

        const newReq = {
            sender: {
                email: email,
                userId: userId
            },
            reciever: {
                email: email2,
                userId: userId2
            },
            sendDate: new Date().toUTCString(),
            resolvedDate: null,
            status: 'sent'
        }
        const doc = new Request(newReq);
        await doc.save();
        const sender = await Friend.findOne({ email: email });
        const reciever = await Friend.findOne({ email: email2 });
        sender.requestsSent.push(doc._id);
        reciever.requestRecieved.push(doc._id);
        await sender.save();
        await reciever.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}


async function fetchSentRequests(email, userId) {
    try {
        const temp = await Friend.exists({ email: email });
        if (!temp) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Friend.findOne({ email: email }).populate('requestsSent');
        const ans = [];
        for (let i of doc.requestsSent) {
            const doc2 = await profileModel.findOne({ email: i.reciever.email });
            const obj = { status: i.status, email: i.reciever.email, userId: i.reciever.userId, resolvedDate: i.resolvedDate, sendDate: i.sendDate, profilePic: doc2.profilePic, username: doc2.username }
            ans.push(obj);
        }
        console.log(ans);
        return ans;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function deleteFriend(email, userId, email2, userId2) {
    try {
        const temp1 = await userModel.exists({ email: email, userId: userId });
        const temp2 = await userModel.exists({ email: email2, userId: userId2 });
        console.log(email, userId, email2, userId2, temp1, temp2);
        if (!temp1 || !temp2) {
            throw "wronginfo";
        }
        const temp3 = await Friend.exists({ email: email });
        if (!temp3) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "user1CreationFailed";
            }
        }
        const temp4 = await Friend.exists({ email: email2 });
        if (!temp4) {
            const res = await addEntry(email2, userId2);
            if (!res) {
                throw "user2CreationFailed";
            }
        }
        const user1 = await Friend.findOne({ email: email });
        const user2 = await Friend.findOne({ email: email2 });
        user1.friends = user1.friends.filter((i) => i.email != email2);
        user2.friends = user2.friends.filter((i) => i.email != email);
        await user1.save();
        await user2.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}


async function fetchRecievedRequests(email, userId) {
    try {
        const temp = await Friend.exists({ email: email });
        if (!temp) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Friend.findOne({ email: email }).populate('requestRecieved');
        const ans = [];
        for (let i of doc.requestRecieved) {
            const doc2 = await profileModel.findOne({ email: i.sender.email });
            const obj = { status: i.status, email: i.sender.email, userId: i.sender.userId, resolvedDate: i.resolvedDate, sendDate: i.sendDate, profilePic: doc2.profilePic, username: doc2.username }
            ans.push(obj);
        }
        console.log(ans);
        return ans;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function closeFriendRequest(email, userId, email2, userId2, val) {
    try {
        const temp1 = await userModel.exists({ email: email, userId: userId });
        const temp2 = await userModel.exists({ email: email2, userId: userId2 });
        console.log(email, userId, email2, userId2, temp1, temp2);
        if (!temp1 || !temp2) {
            throw "wronginfo";
        }
        const temp3 = await Friend.exists({ email: email });
        if (!temp3) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "user1CreationFailed";
            }
        }
        const temp4 = await Friend.exists({ email: email2 });
        if (!temp4) {
            const res = await addEntry(email2, userId2);
            if (!res) {
                throw "user2CreationFailed";
            }
        }
        const now = new Date().toUTCString();
        const req = await Request.findOne({ 'sender.email': email, 'reciever.email': email2, status: 'sent' })
        if (!req) {
            throw "reqnotfound";
        }
        if (!val) {
            req.status = 'rejected';
        } else {
            const user1 = await Friend.findOne({ email: email });
            const user2 = await Friend.findOne({ email: email2 });
            if (!user1.friends.find((i) => i.email === email2)) {
                user1.friends.push({ email: email2, userId: userId2, date: now });
            }
            if (!user2.friends.find((i) => i.email === email)) {
                user2.friends.push({ email: email, userId: userId, date: now });
            }
            await user1.save();
            await user2.save();
            req.status = 'accepted';
        }
        req.resolvedDate = now;
        await req.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}


const Friend = mongoose.model('Friend', friendSchema);
const Request = mongoose.model('Request', requestSchema);



exports.friendModel = Friend;
exports.requestModel = Request;
exports.getFriends = getFriends;
exports.getQueryResults = getQueryResults;
exports.createNewRequest = createNewRequest;
exports.fetchSentRequests = fetchSentRequests;
exports.fetchRecievedRequests = fetchRecievedRequests;
exports.closeFriendRequest = closeFriendRequest;
exports.deleteFriend = deleteFriend;
exports.getCountOfFriends = getCountOfFriends;



