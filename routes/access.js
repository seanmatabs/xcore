var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var csv = require("fast-csv");
var fs = require("file-system");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kusilex",
  database: "kxcreporting"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  con.query("select * from kxcreporting.access", function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
    res.send(result);
  });
});

router.post('/', function(req, res, next) {

  if(req.body.username) {
    con.query("select * from kxcreporting.access where time between '" + req.body.date + "' and '" + req.body.end + "' and name like '%" + req.body.username + "%'", function (err, result) {
      if (err) res.status(400).send(err);
      console.log("Result: " + JSON.stringify(result));
      res.send(result);
    });
  }else{
    con.query("select * from kxcreporting.access where time between '" + req.body.date + "' and '" + req.body.end + "'", function (err, result) {
      if (err) res.status(400).send(err);
      console.log("Result: " + JSON.stringify(result));
      res.send(result);
    });
  }
});
router.get('/get_file/', function (req,res,next) {
  var listdata = [];
  csv.fromPath("Xcore_Data/access.txt",{headers:true})
    .on("data", function(data){
      console.log(data);
      con.query("INSERT INTO `kxcreporting`.`access` ( `time`, `terminal`, `name`, `card_number`) " +
        "VALUES ( '"+ data.Time +"', '"+ data.DeviceName +"', '"+ data.FirstName + " " + data.LastName +"', '"+ data.CardNumber +"');"
        , function (err, result) {
          if (err) console.log(err);
          console.log("Result: " + JSON.stringify(result));
        });
      listdata.push(data);
    })
    .on("end", function(){
      console.log("done");
      fs.rename('Xcore_Data/access.txt', 'Xcore_Data/access-'+new Date().getDate()+'-'+new Date().getMonth()+'-'+new Date().getFullYear()+'_'+new Date().getHours()+':'+new Date().getMinutes()+'.txt', function (err) {
        if (err) throw err;
        console.log('renamed complete');
        res.json(listdata)
      });
    });
});
//Time,DeviceName,FirstName,LastName,CardNumber,JobTitle

//INSERT INTO `kxcreporting`.`access` (`id`, `time`, `terminal`, `name`) VALUES ('0', '134554', 'gffgff', 'fggfgdf');

module.exports = router;
