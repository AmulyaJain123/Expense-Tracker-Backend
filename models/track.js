const mongoose = require('mongoose');
const { categories, trackTags } = require('../util/misc');


const transactionSchema = mongoose.Schema({
    createdOn: {
        type: 'String'
    },
    category: {
        type: ['String']
    },
    transactionAmount: {
        type: 'Number'
    },
    transactionType: {
        type: 'String'
    },
    transactionName: {
        type: 'String'
    },
    from: {
        type: 'String'
    },
    to: {
        type: 'String'
    },
    dateTime: {
        type: 'String'
    },
    transactionId: {
        type: 'String'
    },
    desc: {
        type: 'String',
        default: ""
    },
    tags: {
        type: ['String'],
        default: []
    }
})


const trackSchema = mongoose.Schema({
    email: {
        type: 'String',
    },
    userId: {
        type: 'String'
    },
    categories: {
        type: 'Object',
        default: categories
    },
    tags: {
        type: ['String'],
        default: trackTags
    },
    transactions: {
        type: [transactionSchema],
        default: []
    }
})

async function addEntry(email, userId) {
    try {
        const doc = new Track({ email, userId });
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getCountOfTransactions(email, userId) {
    try {
        const temp = await Track.exists({ email: email });
        if (!temp) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Track.findOne({ email: email });
        if (!doc) {
            throw "notfound";
        }
        return doc.transactions.length;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchCategories(email, userId) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const doc = await Track.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        return doc.categories;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchTags(email, userId) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const doc = await Track.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        return doc.tags;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchTransactions(email, userId) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const doc = await Track.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        return doc.transactions;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchTransaction(email, userId, transactionId) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const doc = await Track.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        const obj = doc.transactions.find((i) => i.transactionId === transactionId);
        return obj;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function removeCategory(email, userId, value) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const doc = await Track.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }

        for (let i of doc.transactions) {
            if ((value.length === 3 && i.category.length === 3 && i.category[0] === value[0] && i.category[1] === value[1] && i.category[2] === value[2]) || (value.length === 2 && i.category.length === 3 && i.category[0] === value[0] && i.category[1] === value[1])) {
                i.category = [value[0], 'null'];
            }
        }

        if (value.length === 3) {
            const obj = doc.categories[value[0]].find((i) => i.name === value[1]);
            obj.categories = obj.categories.filter((i) => i != value[2]);
        } else {
            doc.categories[value[0]] = doc.categories[value[0]].filter((i) => i.name != value[1]);
        }
        doc.markModified('categories');
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}




async function appendCategory(email, userId, value, path) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const doc = await Track.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        if (path.length === 2) {
            doc.categories[path[0]].find((i) => i.name === path[1]).categories.unshift(value);
        } else {
            doc.categories[path[0]].unshift({ name: value, categories: [] });
        }
        doc.markModified('categories');
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function addTransaction(email, userId, transaction) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Track.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        doc.transactions.push(transaction);
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function removeTransaction(email, userId, transactionId) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Track.findOne({ email: email });
        if (!doc) {
            throw "failed";
        }
        doc.transactions = doc.transactions.filter((i) => i.transactionId != transactionId);
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function appendTag(email, userId, val) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Track.findOne({ email: email });
        if (val.length === 0) {
            return "Invalid Tag";
        }
        if (val.length > 20) {
            return "Tag Length must be less or equal to 20."
        }
        for (let i of doc.tags) {
            if (i.trim().toLowerCase() === val.toLowerCase()) {
                return "Tag already exists."
            }
        }
        doc.tags.unshift(val);
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return "Something went wrong.";
    }
}

async function renameTag(email, userId, preVal, newVal) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Track.findOne({ email: email });
        if (newVal.length === 0) {
            return "Invalid Tag";
        }
        if (newVal.length > 20) {
            return "Tag Length must be less or equal to 20."
        }
        if (!doc.tags.some((i) => i.trim().toLowerCase() === preVal.trim().toLowerCase())) {
            return "Old Tag does not exists.";
        }
        if (doc.tags.some((i) => i.trim().toLowerCase() === newVal.trim().toLowerCase())) {
            return "New Tag already exists.";
        }
        doc.transactions.forEach((i) => {
            i.tags = i.tags.map((j) => {
                if (j.trim().toLowerCase() === preVal.trim().toLowerCase()) {
                    return newVal;
                }
                return j;
            })
        })
        doc.tags = doc.tags.map((i) => {
            if (i.trim().toLowerCase() === preVal.trim().toLowerCase()) {
                return newVal;
            }
            return i;
        })
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return "Something went wrong.";
    }
}

async function renameSubCat(email, userId, preVal, newVal) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Track.findOne({ email: email });
        if (newVal[2].length === 0) {
            return "Invalid Category";
        }
        if (newVal[2].length > 20) {
            return "Category Length must be less or equal to 20."
        }
        if (!doc.categories[preVal[0]].some((i) => i.name.trim().toLowerCase() === preVal[1].trim().toLowerCase()) || !doc.categories[preVal[0]].find((i) => i.name.trim().toLowerCase() === preVal[1].trim().toLowerCase())?.categories.some((j) => j.trim().toLowerCase() === preVal[2].trim().toLowerCase())) {
            return "Old Category does not exists.";
        }
        if (!doc.categories[newVal[0]].some((i) => i.name.trim().toLowerCase() === newVal[1].trim().toLowerCase())) {
            return 'Invalid Migration.'
        }
        if (doc.categories[preVal[0]].find((i) => i.name.trim().toLowerCase() === newVal[1].trim().toLowerCase())?.categories.some((j) => j.trim().toLowerCase() === newVal[2].trim().toLowerCase())) {
            return "New Category already exists.";
        }
        doc.transactions.forEach((i) => {
            if (i.category.length === 3 && i.category[0].toLowerCase() === preVal[0].toLowerCase() && i.category[1].toLowerCase() === preVal[1].toLowerCase() && i.category[2].toLowerCase() === preVal[2].toLowerCase()) {
                i.category = newVal;
            }
        })
        doc.categories[preVal[0]].find((i) => i.name.toLowerCase() === preVal[1].toLowerCase()).categories = doc.categories[preVal[0]].find((i) => i.name.toLowerCase() === preVal[1].toLowerCase()).categories.filter((j) => j.toLowerCase() != preVal[2].toLowerCase());
        doc.categories[newVal[0]].find((i) => i.name.toLowerCase() === newVal[1].toLowerCase()).categories.unshift(newVal[2]);
        doc.markModified('categories', 'transactions.category');
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return "Something went wrong.";
    }
}

async function renameCat(email, userId, preVal, newVal) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Track.findOne({ email: email });
        if (newVal[1].length === 0) {
            return "Invalid Group";
        }
        if (newVal[1].length > 20) {
            return "Group Length must be less or equal to 20."
        }
        if (!doc.categories[preVal[0]].some((i) => i.name.trim().toLowerCase() === preVal[1].trim().toLowerCase())) {
            return "Old Group does not exists.";
        }
        if (doc.categories[preVal[0]].some((i) => i.name.trim().toLowerCase() === newVal[1].trim().toLowerCase())) {
            return "New Group already exists.";
        }
        doc.transactions.forEach((i) => {
            if (i.category.length === 3 && i.category[0].toLowerCase() === preVal[0].toLowerCase() && i.category[1].toLowerCase() === preVal[1].toLowerCase()) {
                i.category[1] = newVal[1];
            }
        })
        doc.categories[preVal[0]].find((i) => i.name.toLowerCase() === preVal[1].toLowerCase()).name = newVal[1];
        doc.markModified('categories', 'transactions.category');
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return "Something went wrong.";
    }
}

async function removeTag(email, userId, val) {
    try {
        const res = await Track.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Track.findOne({ email: email });
        doc.tags = doc.tags.filter((i) => i != val);
        for (let i of doc.transactions) {
            i.tags = i.tags.filter((i) => i != val);
        }
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}


const Track = mongoose.model('Track', trackSchema);


exports.trackModel = Track;
exports.fetchCategories = fetchCategories;
exports.appendCategory = appendCategory;
exports.removeCategory = removeCategory;
exports.addTransaction = addTransaction;
exports.fetchTransactions = fetchTransactions;
exports.fetchTransaction = fetchTransaction;
exports.removeTransaction = removeTransaction;
exports.getCountOfTransactions = getCountOfTransactions;
exports.fetchTags = fetchTags;
exports.appendTag = appendTag;
exports.removeTag = removeTag;
exports.renameTag = renameTag;
exports.renameSubCat = renameSubCat;
exports.renameCat = renameCat;



