const mongoose = require('mongoose');
const { categories } = require('../util/misc');


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




