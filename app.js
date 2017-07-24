var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var avatar = require('avatar-generator');
var index = require('./routes/index');
var users = require('./routes/users');
var terminals = require('./routes/terminals');
var access = require('./routes/access');
var cons = require('consolidate');
var mysql = require('mysql');
var cron = require('node-cron');
var csv = require("fast-csv");
var fs = require("file-system");
var sql = require('mssql');
var csv = require("fast-csv");
var fs = require("file-system");
var app = express();
app.get('*',index);
// view engine setup
app.engine ('html',cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
app.use('/app', express.static(path.join(__dirname, 'app')));
app.use('/bower_components',express.static(path.join(__dirname,'bower_components')));
app.use('/', index);
app.use('/users', users);
app.use('/terminals', terminals);
app.use('/access',access);
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "infoware"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

cron.schedule('* * * * *', function(){
  console.log('Looking for new access');
  //Check for new Access Logs
  if (fs.existsSync('Xcore_Data/access.txt')) {
    csv.fromPath("Xcore_Data/access.txt",{headers:true})
      .on("data", function(data){
        console.log(data);
        con.query("INSERT INTO `kxcreporting`.`access` ( `time`, `terminal`, `name`, `card_number`) " +
          "VALUES ( '"+ data.Time +"', '"+ data.DeviceName +"', '"+ data.FirstName + " " + data.LastName +"', '"+ data.CardNumber +"');"
          , function (err, result) {
            if (err) console.log(err);
            console.log("Result: " + JSON.stringify(result));
          });
      })
      .on("end", function(){
        console.log("done");
        fs.rename('Xcore_Data/access.txt', 'Xcore_Data/access-'+new Date().getDate()+'-'+new Date().getMonth()+'-'+new Date().getFullYear()+'_'+new Date().getHours()+'_'+new Date().getMinutes()+'.txt', function (err) {
          if (err) throw err;
          console.log('renamed complete');
        });
      });
  }
});

cron.schedule('* * 23 * *', function(){
  console.log('Looking for new terminals');
  //Check for new terminals
  if (fs.existsSync('Xcore_Data/terminals.txt')) {
    csv.fromPath("Xcore_Data/terminals.txt",{headers:true})
      .on("data", function(data){
        console.log(data);
        con.query("INSERT INTO `kxcreporting`.`terminals` (`description`, `vterminal_key`, `morpho_id`)" +
          "VALUES ('"+ data.DESCRIPTION +"', '"+ data.NAME_ +"', '"+ data.ID +"');"
          , function (err, result) {
            if (err) console.log(err);
            console.log("Result: " + JSON.stringify(result));
          });
      })
      .on("end", function() {
        console.log("done");
        fs.rename('Xcore_Data/terminals.txt', 'Xcore_Data/terminals-' + new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear() + '_' + new Date().getHours() + '_' + new Date().getMinutes() + '.txt', function (err) {
          if (err) throw err;
          console.log('renamed complete');
        });
      });
  }
});
cron.schedule('* * 23 * *', function(){
  console.log('Looking for new users');
  //Check for new users
  if (fs.existsSync('Xcore_Data/all_users.txt')) {
    csv.fromPath("Xcore_Data/all_users.txt",{headers:true})
      .on("data", function(data){
        console.log(data);
        con.query("INSERT INTO `kxcreporting`.`users` (`name`, `card_number`, `company`, `morpho_id`,`created`,`modified`,`birthday`) " +
          "VALUES ( '"+ data.Name +" "+ data.LastName +"', '"+ data.CardNumber +"', '"+ data.Company +"', '"+ data.ID +"', '"+ data.Created +"','"+ data.Modified +"', '"+ data.DateOfBirth +"');"
          , function (err, result) {
            if (err) console.log(err);
            console.log("Result: " + JSON.stringify(result));
          });
        listdata.push(data);
      })
      .on("end", function(){
        console.log("done");
        fs.rename('Xcore_Data/all_users.txt', 'Xcore_Data/all_users-'+new Date().getDate()+'-'+new Date().getMonth()+'-'+new Date().getFullYear()+'_'+new Date().getHours()+'_'+new Date().getMinutes()+'.txt', function (err) {
          if (err) throw err;
          console.log('renamed complete');
          res.json(listdata)
        });
      });
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
