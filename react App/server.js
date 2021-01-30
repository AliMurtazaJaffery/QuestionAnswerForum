var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var db=require('mongoose');
db.connect('mongodb://localhost/forum', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if (err)
    console.log("MongoDB connection error: "+err);
  else
    console.log("Connected to MongoDB");
});

//set the Schema
var userSchema=new db.Schema({
  uid:String,
  name: String,
  email:String,
  password:String,
});

var questionSchema=new db.Schema({
  qid:String,
  space:String,
  title:String,
  content:String,
  answer:{answerUsers:[String],
    aid:String,
    qid:String,
    content:String,
    uid:String,
    uname:String,
    ansDate:String
  },
  up:[String],
  date:String,
  creatorid:String,
  creatorName:String,
});

// var answerSchema=new db.Schema({
//   aid:String,
//   qid:String,
//   content:String,
//   uid:String,
//   uname:String,
// })

//create my model

var user=db.model("user",userSchema);
var question=db.model("question",questionSchema);



var indexRouter = require('./routes/index');


var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

//Add session middleware to the pipeline
var session=require("express-session");
app.use(session({secret:"happiness"}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//make our model accessible to routers
app.use(function(req,res,next){
  req.user=user;
  req.question=question;

  next();
})

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
