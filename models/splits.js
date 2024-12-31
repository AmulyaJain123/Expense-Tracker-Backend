const mongoose = require('mongoose');
const { getProfileByuserId } = require('../models/profile')
const { getFriends } = require('../models/friends')
const { generateId } = require('../util/nodemailer')


const sharedToSchema = mongoose.Schema({
    username: {
        type: 'String',
    },
    userId: {
        type: 'String',
    },
    profilePic: {
        type: 'String',
    },
    sharedOn: {
        type: 'String',
    }
})

const shareSchema = mongoose.Schema({
    name: {
        type: 'String',
    },
    share: {
        type: 'Number',
    },
})

const billSchema = mongoose.Schema({
    billName: {
        type: 'String',
    },
    billDate: {
        type: 'String',
    },
    description: {
        type: 'String',
    },
    totalAmt: {
        type: 'String',
    },
    payedBy: {
        type: 'String',
    },
    id: {
        type: 'String',
    },
    shares: {
        type: [shareSchema],
        default: []
    },
})

const friendSchema = mongoose.Schema({
    name: {
        type: 'String',
    },
})

const singleSplitSchema = mongoose.Schema({
    splitId: {
        type: 'String',
    },
    splitInfo: {
        splitName: {
            type: 'String',
        },
        splitDate: {
            type: 'String',
        },
        description: {
            type: 'String',
        },
    },
    sharedTo: {
        type: [sharedToSchema],
        default: []
    },
    friends: {
        type: [friendSchema],
        default: []
    },
    bills: {
        type: [billSchema],
        default: []
    },
    split: {
        type: ['Array'],
        default: []
    },

})

const singleSharedSplitSchema = mongoose.Schema({
    splitId: {
        type: 'String',
    },
    splitInfo: {
        splitName: {
            type: 'String',
        },
        splitDate: {
            type: 'String',
        },
        description: {
            type: 'String',
        },
        sharedOn: {
            type: 'String',
        },
        sharedBy: {
            username: {
                type: 'String',
            },
            userId: {
                type: 'String',
            },
            profilePic: {
                type: 'String',
            },
        },
    },
    friends: {
        type: [friendSchema],
        default: []
    },
    bills: {
        type: [billSchema],
        default: []
    },
    split: {
        type: ['Array'],
        default: []
    },

})

const splitSchema = mongoose.Schema({
    email: {
        type: 'String',
    },
    username: {
        type: 'String',
    },
    splits: {
        type: [singleSplitSchema],
        default: []
    },
    sharedSplits: {
        type: [singleSharedSplitSchema],
        default: []
    }
})

async function addEntry(email, userId) {
    try {
        const doc = new Split({ email, userId });
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getCountOfSplits(email, userId) {
    try {
        const temp = await Split.exists({ email: email });
        if (!temp) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Split.findOne({ email: email });
        if (!doc) {
            throw "notfound";
        }
        return { byMe: doc.splits.length, sharedToMe: doc.sharedSplits.length };
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function newSplit(email, userId, split, id) {
    try {
        const res = await Split.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Split.findOne({ email: email });
        doc.splits.push({ ...split, splitId: id, sharedTo: [] });
        await doc.save()
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchSavedSplits(email, userId) {
    try {
        const res = await Split.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Split.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        return doc.splits;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchSharedSplits(email, userId) {
    try {
        const res = await Split.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Split.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        return doc.sharedSplits;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchSavedSplit(email, userId, splitId) {
    try {
        const res = await Split.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Split.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        const split = doc.splits.find((i) => i.splitId === splitId);
        if (!split) {
            throw "notfound";
        }
        return split;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchSharedSplit(email, userId, splitId) {
    try {
        const res = await Split.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Split.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        const split = doc.sharedSplits.find((i) => i.splitId === splitId);
        console.log(split);
        if (!split) {
            throw "notfound";
        }
        return split;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function removeSavedSplit(email, userId, splitId) {
    try {
        const res = await Split.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Split.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        doc.splits = doc.splits.filter((i) => i.splitId != splitId);
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function removeSharedSplit(email, userId, splitId) {
    try {
        const res = await Split.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Split.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        doc.sharedSplits = doc.sharedSplits.filter((i) => i.splitId != splitId);
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function shareToFriend(email, userId, splitId, email2, userId2, now) {
    try {
        const res = await Split.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const sender = await getProfileByuserId(userId);
        if (!sender) {
            return "profilenotfound"
        }

        const doc = await Split.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        const ind = doc.splits.findIndex((i) => i.splitId == splitId);
        if (ind === -1) {
            throw "notfound";
        }

        const res2 = await Split.exists({ email: email2 });
        if (!res2) {
            const res2 = await addEntry(email2, userId2);
            if (!res2) {
                throw "userCreationFailed";
            }
        }
        const doc2 = await Split.findOne({ email: email2 });
        if (!doc2) {
            throw "failed";
        }
        doc2.sharedSplits.push({
            friends: doc.splits[ind].friends,
            bills: doc.splits[ind].bills,
            split: doc.splits[ind].split,
            splitInfo: { ...doc.splits[ind].splitInfo, sharedBy: { username: sender.username, userId: sender.userId, profilePic: sender.profilePic }, sharedOn: now },
            splitId: `${generateId()}`,
        })
        doc2.markModified('sharedSplits');
        await doc2.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function share(email, userId, splitId, friends) {
    try {
        const now = new Date().toUTCString();
        const res = await Split.exists({ email: email });

        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const doc = await Split.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        const ind = doc.splits.findIndex((i) => i.splitId == splitId);
        if (ind === -1) {
            throw "notfound";
        }

        const userFriends = await getFriends(email, userId);
        if (userFriends === null) {
            throw "userfriendsnotfound"
        }
        for (let i of friends) {
            if (userFriends.some((j) => j.userId == i)) {
                continue;
            } else {
                throw "friendnotfound";
            }
        }

        for (let i of friends) {
            // if (doc.splits[ind].sharedTo.some((j) => j.userId == i)) {
            //     console.log("fwef")
            //     continue;
            // }
            const pro = await getProfileByuserId(i);
            if (!pro) {
                throw "friendnotfound";
            }
            const response = await shareToFriend(email, userId, splitId, pro.email, pro.userId, now);
            if (!response) {
                throw "failed";
            }
        }

        const arr = [];
        for (let i of friends) {
            // if (doc.splits[ind].sharedTo.some((j) => j.userId == i)) {
            //     continue;
            // }
            const pro = await getProfileByuserId(i);
            if (!pro) {
                throw "friendnotfound";
            }
            arr.push({
                username: pro.username,
                userId: pro.userId,
                profilePic: pro.profilePic,
                sharedOn: now
            })
        }
        console.log(arr, doc.splits[ind].sharedTo.concat(arr));
        doc.splits[ind].sharedTo = doc.splits[ind].sharedTo.concat(arr);
        console.log(doc.splits[ind].sharedTo);
        doc.markModified('splits');
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}


const Split = mongoose.model('Split', splitSchema);

exports.splitModel = Split;
exports.newSplit = newSplit;
exports.fetchSavedSplits = fetchSavedSplits;
exports.fetchSavedSplit = fetchSavedSplit;
exports.removeSavedSplit = removeSavedSplit;
exports.share = share;
exports.fetchSharedSplits = fetchSharedSplits;
exports.fetchSharedSplit = fetchSharedSplit;
exports.removeSharedSplit = removeSharedSplit;
exports.getCountOfSplits = getCountOfSplits;




