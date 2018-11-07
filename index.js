import express from 'express'
import path from 'path'
import cookiesParser from 'cookie-parser'
import bodyParser from 'body-parser'
import exphbs from 'express-handlebars'
import expressValidotor from 'express-validator'
import flash from 'connect-flash'
import session from 'express-session'
import passport from 'passport'
import localStratergy from 'passport-local'
import mongo from 'mongodb'
import mongoose from 'mongoose'
import { param } from 'express-validator/check';

import routes from './routes/index'

// Mongodb databse connection
mongoose.connect('mongodb://granative:granative1234@ds251223.mlab.com:51223/granative')
mongoose.connection
.once('open', () => console.log('Connected to MongoLab instance.'))
.on('error', error => console.log('Error connecting to MongoLab:', error));



// Init App
const app = express()

// View Engine
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout: 'layout'}))
app.set('view engine', 'handlebars')

// BodyParser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookiesParser())

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Middleware Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))

// Passport init
app.use(passport.initialize())
app.use(passport.session())

// Express Validator (from express validator github)
app.use(expressValidotor({
    errorFormatter: (param, msg, value)=> {
        let namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root
        while(namespace.length) {
            formParam += '[' +namespace.shift() + ']'
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

// Connect flash Middleware
app.use(flash())

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

app.use('/nodative/api/v1/', routes)

app.use('/nodative/api/v1/', (req, res, next) => {
    res.status(404).json({
      info: `Cannot ${req.method}: '${req.path}`,
    })
  })

// Set Port
app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), ()=>console.log(`App is listening at ${app.get('port')}`))
