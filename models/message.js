const mongoose = require('mongoose');

const { getProfileByuserId, getProfileById } = require('./profile')
const { generateId } = require('../util/nodemailer')
const { sendFirstChatUpdate, sendMessageUpdate, sendMessageSeenUpdate } = require('../util/socket');



const chatSchema = mongoose.Schema({
    groupChat: {
        type: 'Boolean',
        default: false
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId, ref: "Profile"
            },
            joinedOn: 'String',
            visible: {
                type: 'Boolean',
                default: false
            },
            blocked: {
                type: 'Boolean',
                default: false
            }
        }
    ],
    createdOn: {
        type: 'String',
        default: null
    },
    chatId: 'String',
    chatHistory: {
        type: [
            {
                message: 'String',
                msgType: 'String',
                sender: {
                    userType: 'String',
                    details: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Profile",
                    }
                },
                seen: {
                    type: [
                        {
                            user: {
                                type: mongoose.Schema.Types.ObjectId, ref: "Profile"
                            },
                            seenOn: 'String',
                        }
                    ],
                    default: []
                },
                deleted: {
                    type: [
                        {
                            user: {
                                type: mongoose.Schema.Types.ObjectId, ref: "Profile"
                            },
                            deletedOn: 'String',
                        }
                    ],
                    default: []
                },

                msgDate: 'String',
                msgId: 'String',
            }
        ],
        default: []
    }
}, { versionKey: false })

const messageSchema = mongoose.Schema({
    email: 'String',
    userId: 'String',
    chats: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        }],
        default: []
    }
}, { versionKey: false })

async function addEntry(email, userId) {
    try {
        const doc = new Message({ email, userId });
        await doc.save();
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchChats(email, userId) {
    try {
        const res = await Message.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Message.findOne({ email: email }).populate({
            path: "chats",
            populate: [
                {
                    path: "members.user",
                    select: "userId username profilePic fullname"
                },
                {
                    path: "chatHistory.sender.details",
                    select: "userId username profilePic fullname"
                },
                {
                    path: "chatHistory.seen.user",
                    select: "userId username profilePic fullname"
                },
                {
                    path: "chatHistory.deleted.user",
                    select: "userId username profilePic fullname"
                }
            ]
        });

        return doc.chats;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function fetchUnseenMessages(email, userId) {
    try {
        const res = await Message.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }
        const doc = await Message.findOne({ email: email }).populate({
            path: "chats",
            populate: [
                {
                    path: "members.user",
                    select: "userId "
                },
                {
                    path: "chatHistory.sender.details",
                    select: "userId "
                },
                {
                    path: "chatHistory.seen.user",
                    select: "userId "
                }
            ]
        });
        const obj = {};
        for (let chat of doc.chats) {
            if (chat.members.find((i) => i.user.userId === userId && i.blocked === true)) {
                continue;
            }
            const chatId = chat.chatId;
            let count = 0;
            for (let msg of chat.chatHistory.toReversed()) {
                if (msg.sender.details.userId === userId) {
                    continue;
                } else if (!msg.seen.some((i) => i.user.userId === userId)) {
                    ++count;
                } else {
                    break;
                }
            }
            if (count > 0) {
                obj[chatId] = count;
            }
        }
        return obj;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function addChat(email, userId, userId2) {
    try {
        const res = await Message.exists({ email: email });
        if (!res) {
            const res = await addEntry(email, userId);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const user1 = await getProfileByuserId(userId);
        if (!user1) {
            throw 'notfound';
        }

        const user2 = await getProfileByuserId(userId2);
        if (!user2) {
            throw 'notfound';
        }

        const res2 = await Message.exists({ userId: userId2 });
        if (!res2) {
            const res = await addEntry(user2.email, userId2);
            if (!res) {
                throw "userCreationFailed";
            }
        }

        const doc = await Message.findOne({ userId: userId });
        // const doc2 = await Message.findOne({ userId: userId2 });

        const chat = await Chat.findOne({
            groupChat: false,
            "members.user": { $all: [user1._id, user2._id] },
        }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname');

        if (chat) {
            if (!doc.chats.includes(chat._id)) {
                doc.chats.push(chat._id);
                chat.members.find((i) => i.user.userId === user1.userId).visible = true;
                await doc.save();
                await chat.save();

            }
            // else if (!doc2.chats.includes(chat._id)) {
            //     doc2.chats.push(chat._id);
            //     await doc2.save();
            // }
        } else {
            let id = `${generateId()}`;
            let now = new Date().toUTCString();
            const chat = { groupChat: false, members: [{ user: user2._id, joinedOn: now }, { user: user1._id, joinedOn: now, visible: true }], createdOn: now, chatId: id };
            const newChat = new Chat(chat);
            await newChat.save();
            doc.chats.push(newChat._id);
            // doc2.chats.push(newChat._id);
            await doc.save();
            // await doc2.save();
        }

        const finalChat = await Chat.findOne({
            groupChat: false,
            "members.user": { $all: [user1._id, user2._id] },
        }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname').populate('chatHistory.deleted.user', 'username userId profilePic fullname');

        return finalChat;
    } catch (err) {
        console.log(err);
        return null;
    }
}
async function addMsg(email, userId, data) {
    try {
        const user = await getProfileByuserId(userId);
        if (!user) {
            throw "notfound";
        }
        const now = new Date().toUTCString();
        const message = {
            message: data.msg,
            msgType: 'msg-text',
            sender: {
                userType: 'user',
                details: user._id
            },
            seen: [],
            deleted: [],
            msgDate: now,
            msgId: data.msgId
        }
        const chat = await Chat.findOne({ chatId: data.chatId }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname').populate('chatHistory.deleted.user', 'username userId profilePic fullname');
        let stat = false;
        //checking if the message is the first message to a personal chat. In that case will have to add the chat to the other users's messages doc.
        const mem = chat.members.find((i) => i.user.userId != user.userId);
        if (!chat.groupChat && mem.visible === false) {
            const doc = await Message.findOne({ userId: mem.user.userId })
            doc.chats.push(chat._id);
            mem.visible = true;
            await doc.save();
            stat = true;
        }
        chat.chatHistory.push(message);
        await chat.save();

        const newChat = await Chat.findOne({ chatId: data.chatId }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname').populate('chatHistory.deleted.user', 'username userId profilePic fullname');
        const newMsg = newChat.chatHistory.find((i) => i.msgId === data.msgId);
        // sending realtime updates
        if (stat && mem.blocked === false) {
            sendFirstChatUpdate(mem.user.userId, newChat);
        } else if (mem.blocked === false) {
            sendMessageUpdate(mem.user.userId, chat.chatId, newMsg);
        }

        return now;
    } catch (err) {
        console.log(err);
        return null;
    }
}
async function msgSeen(email, userId, data) {
    try {
        const user = await getProfileByuserId(userId);
        const now = new Date().toUTCString();
        const chat = await Chat.findOne({ chatId: data.chatId }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname').populate('chatHistory.deleted.user', 'username userId profilePic fullname');
        const setOfMembers = new Set();
        for (let i = chat.chatHistory.length - 1; i > -1; --i) {
            const msg = chat.chatHistory[i];
            if (msg.sender.details.userId != userId && !msg.seen.some((j) => j.user.userId === userId)) {
                msg.seen.push({ user: user._id, seenOn: now });
                setOfMembers.add(msg.sender.details.userId);
            } else if (msg.sender.details.userId != userId) {
                break;
            }
        }
        await chat.save();
        const newChat = await Chat.findOne({ chatId: data.chatId }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname').populate('chatHistory.deleted.user', 'username userId profilePic fullname');

        // sending realtime message-seen updates to the message sender
        setOfMembers.forEach((i) => {
            if (newChat.members.find((j) => j.user.userId === i && j.blocked === false)) {
                sendMessageSeenUpdate(i, newChat);
            }
        })
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function removeChat(email, userId, data) {
    try {
        const chat = await Chat.findOne({ chatId: data.chatId }).populate('members.user', 'userId');
        const doc = await Message.findOne({ userId: userId });
        doc.chats = doc.chats.filter((i) => {
            console.log(i.toString(), chat._id.toString());
            return i.toString() != chat._id.toString()
        });
        await doc.save();
        chat.members.find((i) => i.user.userId === userId).visible = false;
        await chat.save();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function deleteMsg(email, userId, data) {
    try {
        const { chatId, msgId } = data;
        const user = await getProfileByuserId(userId);
        const now = new Date().toUTCString();
        const chat = await Chat.findOne({ chatId: chatId }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname');
        chat.chatHistory.find((i) => i.msgId === msgId)?.deleted.push({ user: user._id, deletedOn: now });
        await chat.save();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function clearChat(email, userId, data) {
    try {
        const { chatId } = data;
        const user = await getProfileByuserId(userId);
        const now = new Date().toUTCString();
        const chat = await Chat.findOne({ chatId: chatId }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname');
        chat.chatHistory.forEach((i) => {
            if (i.msgType === 'msg-text') {
                i.deleted.push({ user: user._id, deletedOn: now });
            }
        })
        await chat.save();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function blockChat(email, userId, data) {
    try {
        const { chatId } = data;
        const chat = await Chat.findOne({ chatId: chatId }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname');
        const member = chat.members.find((i) => i.user.userId === userId);
        member.blocked = true;
        await chat.save();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function unblockChat(email, userId, data) {
    try {
        const { chatId } = data;
        const chat = await Chat.findOne({ chatId: chatId }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname');
        const member = chat.members.find((i) => i.user.userId === userId);
        member.blocked = false;
        await chat.save();
        const newChat = await Chat.findOne({ chatId: data.chatId }).populate('members.user', 'username userId profilePic fullname').populate('chatHistory.sender.details', 'username userId profilePic fullname').populate('chatHistory.seen.user', 'username userId profilePic fullname').populate('chatHistory.deleted.user', 'username userId profilePic fullname');
        let count = 0;
        for (let msg of newChat.chatHistory.toReversed()) {
            if (msg.sender.details.userId === userId) {
                continue;
            } else if (!msg.seen.some((i) => i.user.userId === userId)) {
                ++count;
            } else {
                break;
            }
        }
        return { chat: newChat, count: count };
    } catch (err) {
        console.log(err);
        return false;
    }
}


const Message = mongoose.model('Message', messageSchema);
const Chat = mongoose.model('Chat', chatSchema);






exports.messageModel = Message;
exports.chatModel = Chat;
exports.fetchChats = fetchChats;
exports.addChat = addChat;
exports.addMsg = addMsg;
exports.msgSeen = msgSeen;
exports.fetchUnseenMessages = fetchUnseenMessages;
exports.removeChat = removeChat;
exports.deleteMsg = deleteMsg;
exports.clearChat = clearChat;
exports.blockChat = blockChat;
exports.unblockChat = unblockChat;





