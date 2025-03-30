
const { userToSocketMap } = require('./state')
let io;

const setIo = (val) => {
    io = val;
}


const sendNotificationUpdate = (email, userId, notification) => {
    io.to(userId).emit('new-notification', notification);
}

const sendFirstChatUpdate = (userId, chat) => {
    io.to(userId).emit('new-chat-message', chat);
}

const sendMessageUpdate = (userId, chatId, msg) => {
    io.to(userId).emit('new-message', { chatId, msg });
}

const sendMessageSeenUpdate = (userId, chat) => {
    const filteredChat = removeDeleted(userId, chat);
    io.to(userId).emit('message-seen', filteredChat);
}



const removeDeleted = (userId, chat) => {
    try {
        chat.chatHistory = chat.chatHistory.filter((i) => {
            return !i.deleted.some((j) => j.user.userId === userId);
        })
        return chat;
    } catch (err) {
        console.log(err);
        return null;
    }
}

exports.setIo = setIo;
exports.sendNotificationUpdate = sendNotificationUpdate;
exports.sendFirstChatUpdate = sendFirstChatUpdate;
exports.sendMessageUpdate = sendMessageUpdate;
exports.sendMessageSeenUpdate = sendMessageSeenUpdate;


