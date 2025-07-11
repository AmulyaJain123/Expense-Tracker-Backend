const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { connectToDB } = require('./util/database');
require('dotenv').config();
const cors = require('cors')
const { Server } = require('socket.io')
const { userToSocketMap } = require('./util/state');
const { setIo } = require('./util/socket');
const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken')

const { isAuth } = require('./middlewares/auth')

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { vaultRouter } = require('./routes/vault')
const { friendsRouter } = require('./routes/friends')
const { splitsRouter } = require('./routes/splits')
const { trackRouter } = require('./routes/track')
const { notificationsRouter } = require('./routes/notifications')
const { openRouter } = require('./routes/open');
const { messageRouter } = require('./routes/message');

const { readNotifications, removeNotification } = require('./models/notifications')
const { msgSeen, removeChat, deleteMsg, clearChat, blockChat, unblockChat } = require('./models/message')

const { newMsg } = require('./controllers/message')




const app = express();
const server = http.createServer(app)
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');



app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

const FRONTEND_URL = process.env.STATUS === 'dev' ? process.env.FRONTEND_URL_DEV : process.env.FRONTEND_URL_PROD;

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));

app.options('*', cors()); 


app.use(cookieParser())

app.use((req, res, next) => {
    // console.log(req.headers, req.cookies);
    next();
})

app.use('/auth', authRouter)

app.use('/open', openRouter);

app.use(isAuth);

app.use('/profile', profileRouter)

app.use('/vault', vaultRouter)

app.use('/friends', friendsRouter)

app.use('/split', splitsRouter)

app.use('/track', trackRouter)

app.use('/notifications', notificationsRouter)

app.use('/message', messageRouter);


const io = new Server(server, {
    cors: {
        origin: [FRONTEND_URL],
        credentials: true
    },

})

setIo(io);

const getIo = () => {
    return io;
}


io.on('connection', (socket) => {
    try {
        console.log("Connection Formed", socket.id);
        // Just after Connection
        try {
            const cookies = {}
            console.log(socket.handshake.headers.cookie.split(' '));
            socket.handshake.headers.cookie.split(' ').forEach((str) => {
                const key = str.split('=')[0];
                console.log(str.split('=')[1]);
                const value = str.split('=')[1].at(-1) === ';' ? str.split('=')[1].substr(0, str.split('=')[1].length - 1) : str.split('=')[1];
                cookies[key] = value;
            });
            const token = cookies['token'];
            console.log("Token", token);
            if (token) {
                const payload = jwt.verify(token, process.env.JWT_SECRET);
                socket.userDetails = payload;
                console.log(payload);
                if (userToSocketMap[payload.userId]) {
                    userToSocketMap[payload.userId].push(socket.id);
                } else {
                    userToSocketMap[payload.userId] = [socket.id];
                }
            } else {
                throw "notfound";
            }
        } catch (err) {
            console.log(err);
            socket.disconnect(true);
        }

        socket.join(socket.userDetails.userId);
        for (let i of userToSocketMap[socket.userDetails.userId]) {
            if (i != socket.id) {
                io.to(i).emit('socket-activity', false);
            }
        }


        socket.on('disconnect', () => {
            userToSocketMap[socket.userDetails.userId].splice(userToSocketMap[socket.userDetails.userId].indexOf(socket.id), 1);
            if (userToSocketMap[socket.userDetails.userId].length === 0) {
                delete userToSocketMap[socket.userDetails.userId];
            }
            console.log(userToSocketMap);

        })

        socket.on('test', (str) => {
            console.log(str);
        })

        socket.on('read-notifications', (bool) => {
            console.log(bool)
            readNotifications(socket.userDetails.email, socket.userDetails.userId);
        })

        socket.on('send-msg', (info, cb) => {
            console.log(info);
            newMsg(socket.userDetails.email, socket.userDetails.userId, info).then((val) => {
                cb(val);
            }).catch((err) => {
                cb(false);
            });


        })

        socket.on('message-seen', (info) => {
            console.log(info);
            msgSeen(socket.userDetails.email, socket.userDetails.userId, info);
        })

        socket.on('delete-chat', (info, cb) => {
            console.log(info);
            removeChat(socket.userDetails.email, socket.userDetails.userId, info).then((val) => {
                cb(val);
            }).catch((err) => {
                console.log(err)
                cb(false);
            });


        })

        socket.on('delete-msg', (info, cb) => {
            console.log(info);
            deleteMsg(socket.userDetails.email, socket.userDetails.userId, info).then((val) => {
                cb(val);
            }).catch((err) => {
                console.log(err)
                cb(false);
            });


        })

        socket.on('clear-chat', (info, cb) => {
            console.log(info);
            clearChat(socket.userDetails.email, socket.userDetails.userId, info).then((val) => {
                cb(val);
            }).catch((err) => {
                console.log(err)
                cb(false);
            });


        })

        socket.on('block-chat', (info, cb) => {
            console.log(info);
            blockChat(socket.userDetails.email, socket.userDetails.userId, info).then((val) => {
                cb(val);
            }).catch((err) => {
                console.log(err)
                cb(false);
            });
        })

        socket.on('unblock-chat', (info, cb) => {
            console.log(info);
            unblockChat(socket.userDetails.email, socket.userDetails.userId, info).then((val) => {
                cb(val);
            }).catch((err) => {
                console.log(err)
                cb(false);
            });
        })

        socket.on('delete-notification', (info, cb) => {
            console.log(info);
            removeNotification(socket.userDetails.email, socket.userDetails.userId, info).then((val) => {
                cb(val);
            }).catch((err) => {
                console.log(err)
                cb(false);
            });


        })


        console.log(userToSocketMap);
    } catch (err) {
        console.log(err);
        socket.disconnect(true);
    }
})




const main = async () => {
    try {
        await connectToDB();
        console.log("Connection Established")
        server.listen(port);
    }
    catch (error) {
        throw error;
    }
}
main();

