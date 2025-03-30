const mongoose = require('mongoose');
const { sendNotificationUpdate } = require('../util/socket')

const notifySchema = mongoose.Schema({
    message: {
        type: 'String'
    },
    topic: {
        type: 'String'
    },
    recieveDate: {
        type: 'String'
    },
    visited: {
        type: 'Boolean',
        default: false
    },
    visitedDate: {
        type: 'String',
        default: null
    },
    data: {
        type: 'Object',
        default: null
    }
})

const notificationSchema = mongoose.Schema({
    email: {
        type: 'String'
    },
    userId: {
        type: 'String'
    },
    notifications: {
        type: [notifySchema],
        default: []
    }

})



async function addEntry(email, userId) {
    try {
        const doc = new Notification({ email, userId });
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function newNotification(email, userId, notification) {
    try {
        const res = await Notification.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Notification.findOne({ email: email });
        doc.notifications.push({ ...notification });
        await doc.save();
        sendNotificationUpdate(email, userId, notification);
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchNotifications(email, userId) {
    try {
        const res = await Notification.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Notification.findOne({ email: email });
        return doc.notifications;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchUnseenNotifications(email, userId) {
    try {
        const res = await Notification.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Notification.findOne({ email: email });
        return doc.notifications.filter((i) => i.visited === false).reverse();
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function readNotifications(email, userId) {
    try {
        const res = await Notification.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Notification.findOne({ email: email });
        for (let i = doc.notifications.length - 1; i > -1; --i) {
            if (doc.notifications[i].visited === false) {
                doc.notifications[i].visited = true;
            } else {
                break;
            }
        }
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function removeNotification(email, userId, data) {
    try {
        const doc = await Notification.findOne({ email: email });
        doc.notifications = doc.notifications.filter((i) => i._id != data.id)
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}


const Notification = mongoose.model('Notification', notificationSchema);


exports.NotificationModel = Notification;
exports.newNotification = newNotification;
exports.fetchNotifications = fetchNotifications;
exports.fetchUnseenNotifications = fetchUnseenNotifications;
exports.readNotifications = readNotifications;
exports.removeNotification = removeNotification;




