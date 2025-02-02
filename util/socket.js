
const { userToSocketMap } = require('./state')
let io;

const setIo = (val) => {
    io = val;
}


const sendNotificationUpdate = (email, userId, notification) => {
    io.to(userId).emit('new-notification', notification);
}

exports.setIo = setIo;
exports.sendNotificationUpdate = sendNotificationUpdate;

