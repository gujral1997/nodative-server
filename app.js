const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const pe = require('parse-error')
const cors = require('cors')

mongoose.connect('mongodb://granative:granative1234@ds251223.mlab.com:51223/granative')

const routes = require('./routes/index')

// const users = require('./routes/users');

// Init App
const app = express()

// View Engine
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout:'layout'}))
app.set('view engine', 'handlebars')

// CORS
app.use(cors())

// BodyParser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize())
app.use(passport.session())

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      const namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    }
  }
}))

// Connect Flash
app.use(flash())

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 3000);
  res.render('error')
})

app.use('/nodative/api/v1/', routes)

app.use('/nodative/api/v1/', (req, res, next) => {
    res.status(404).json({
      info: `Cannot ${req.method}: '${req.path}`,
    })
})

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});

process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});
