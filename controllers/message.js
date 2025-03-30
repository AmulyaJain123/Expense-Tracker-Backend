const { fetchChats, addChat, addMsg } = require('../models/message');
const { getProfileByuserId } = require('../models/profile');


const getChats = async (req, res) => {
    try {
        let result = await fetchChats(req.userDetails.email, req.userDetails.userId);
        if (result === null) {
            throw "notfound";
        }
        result = result.map((chat) => removeDeleted(req.userDetails.userId, chat));
        result.reverse();

        console.log('fetched chats', result)
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const newChat = async (req, res) => {
    try {
        const result = await addChat(req.userDetails.email, req.userDetails.userId, req.body.userId);
        if (result === null) {
            throw "failed";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const newMsg = async (email, userId, data) => {
    try {
        const result = await addMsg(email, userId, data);
        if (result === null) {
            throw "failed";
        }
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }
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

exports.getChats = getChats;
exports.newChat = newChat;
exports.newMsg = newMsg;
exports.removeDeleted = removeDeleted;



