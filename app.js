const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)


// call the db connection
connectDB();

// load config
dotenv.config();

const app = express();

//Body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)


// import passport strategy
require('./config/passport')(passport)

// register handlebars helper
const {formatDate,truncate,stripTags,editIcon,select} = require('./helpers/helper')

// set view engine
app.engine('.hbs',exphbs({helpers:{
  formatDate,truncate,stripTags,editIcon,select
},defaultLayout:'main', extname:'.hbs'}))
app.set('view engine','.hbs')

// session middleware
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:false,
  store: new MongoStore({mongooseConnection:mongoose.connection})
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// global variables
app.use(function(req,res,next){
  res.locals.user = req.user || null
  next()
})

//static folder
app.use(express.static(path.join(__dirname,'public')))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
})
