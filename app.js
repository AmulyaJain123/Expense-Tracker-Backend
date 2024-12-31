const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { connectToDB } = require('./util/database');
require('dotenv').config();
const cors = require('cors')

const { isAuth } = require('./middlewares/auth')

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { vaultRouter } = require('./routes/vault')
const { friendsRouter } = require('./routes/friends')
const { splitsRouter } = require('./routes/splits')
const { trackRouter } = require('./routes/track')

const app = express();
const server = http.createServer(app)
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


app.use(cookieParser())

app.use((req, res, next) => {
    console.log(req.headers, req.cookies);
    next();
})

app.use('/auth', authRouter)

app.use(isAuth);

app.use('/profile', profileRouter)

app.use('/vault', vaultRouter)

app.use('/friends', friendsRouter)

app.use('/split', splitsRouter)

app.use('/track', trackRouter)









const main = async () => {
    try {
        await connectToDB();
        console.log("Connection Established")
        server.listen(process.env.PORT || 3000);
    }
    catch (error) {
        throw error;
    }
}
main();