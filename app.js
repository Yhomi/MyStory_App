const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)


// call the db connection
connectDB();

// load config
dotenv.config();

const app = express();

// import passport strategy

require('./config/passport')(passport)

// set view engine

app.engine('.hbs',exphbs({defaultLayout:'main', extname:'.hbs'}))
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

//static folder
app.use(express.static(path.join(__dirname,'public')))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
})
