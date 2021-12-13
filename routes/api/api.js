const express = require('express')
const router = express.Router()
const session = require('express-session')
const sessionStore = require('express-mysql-session')(session)
const authRouter = require('./auth')

router.use(session({
    secret : process.env.SESSION_SECRET,
    saveUninitialized : false,
    resave : false,
    name : process.env.SESSION_NAME,
    store : new sessionStore({
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
    })
}))

router.use('/auth', authRouter)

module.exports = router