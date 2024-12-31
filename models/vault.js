const mongoose = require('mongoose');
const { tags } = require('../util/misc')

const fileSchema = mongoose.Schema({
    fakeName: {
        type: 'String'
    },
    previewUrl: {
        type: 'String'
    },
    uploadUrl: {
        type: 'String'
    },
    metaData: {
        name: {
            type: 'String'
        },
        size: {
            type: 'Number'
        },
        type: {
            type: 'String'
        },
    }

})

const receiptSchema = mongoose.Schema({
    recId: {
        type: 'String',
    },
    tags: {
        type: ['String'],
        default: []
    },
    details: {
        recName: {
            type: 'String'
        },
        recDate: {
            type: 'String'
        },
        recDesc: {
            type: 'String'
        },
        recTotal: {
            type: 'String',
            default: null
        },
        createdOn: {
            type: 'String'
        },
    },
    files: {
        type: [fileSchema]
    }

})

const warrantySchema = mongoose.Schema({
    warId: {
        type: 'String',
    },
    tags: {
        type: ['String'],
        default: []
    },
    details: {
        warName: {
            type: 'String'
        },
        warDate: {
            type: 'String'
        },
        warDesc: {
            type: 'String'
        },
        warTotal: {
            type: 'String',
            default: null
        },
        createdOn: {
            type: 'String'
        },
        expiry: {
            mode: 'String',
            duration: {
                years: 'String',
                months: 'String',
                days: 'String'
            },
            date: 'String',
            renewedOn: {
                type: 'String',
                default: null
            }
        }
    },
    files: {
        type: [fileSchema]
    }

})

const vaultSchema = mongoose.Schema({

    email: {
        type: 'String',
    },
    userId: {
        type: 'String',
    },
    receipts: {
        type: [receiptSchema],
        default: []
    },
    warranty: {
        type: [warrantySchema],
        default: []
    },
    tags: {
        type: ['String'],
        default: tags
    }
})



async function addEntry(email, userId) {
    try {
        const doc = new Vault({ email, userId });
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getCountOfVault(email, userId) {
    try {
        const temp = await Vault.exists({ email: email });
        if (!temp) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        if (!doc) {
            throw "notfound";
        }
        return { rec: doc.receipts.length, war: doc.warranty.length };
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function addReceipt(email, userId, receipt) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc);
        doc.receipts.push(receipt);
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function addWarranty(email, userId, warranty) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc);
        doc.warranty.push(warranty);
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchTags(email, userId) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc.tags);
        return doc.tags;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchReceipts(email, userId) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc.receipts);
        return doc.receipts;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchWarranties(email, userId) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc.warranty);
        return doc.warranty;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchWarranty(email, userId, warId) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc.warranty);
        const warranty = doc.warranty.find((i) => i.warId === warId);
        if (!warranty) {
            throw "notFound";
        }
        return warranty;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchReceipt(email, userId, recId) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc.receipts);
        const receipt = doc.receipts.find((i) => i.recId === recId);
        if (!receipt) {
            throw "notFound";
        }
        return receipt;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function removeReceipt(email, userId, recId) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc.receipts);
        doc.receipts = doc.receipts.filter((i) => i.recId != recId);
        await doc.save()
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function removeWarranty(email, userId, warId) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc.warranty);
        doc.warranty = doc.warranty.filter((i) => i.warId != warId);
        await doc.save()
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function changeExp(email, userId, warId, renewedOn, newExpDate) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        console.log(doc.warranty);
        const ind = doc.warranty.findIndex((i) => i.warId === warId);
        doc.warranty[ind].details.expiry.renewedOn = renewedOn;
        doc.warranty[ind].details.expiry.date = newExpDate;
        await doc.save()
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function deleteTag(email, userId, val) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
        doc.tags = doc.tags.filter((i) => i != val);
        for (let i of doc.receipts) {
            i.tags = i.tags.filter((i) => i != val);
        }
        for (let i of doc.warranty) {
            i.tags = i.tags.filter((i) => i != val);
        }
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function appendTag(email, userId, val) {
    try {
        const res = await Vault.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Vault.findOne({ email: email });
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




const Vault = mongoose.model('Vault', vaultSchema);


exports.vaultSchema = Vault;

exports.addReceipt = addReceipt;
exports.addWarranty = addWarranty;
exports.fetchTags = fetchTags;
exports.fetchReceipts = fetchReceipts;
exports.fetchReceipt = fetchReceipt;
exports.removeReceipt = removeReceipt;
exports.removeWarranty = removeWarranty;
exports.changeExp = changeExp;
exports.deleteTag = deleteTag;
exports.appendTag = appendTag;
exports.fetchWarranties = fetchWarranties;
exports.fetchWarranty = fetchWarranty;
exports.getCountOfVault = getCountOfVault;











