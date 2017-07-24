var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require("fs");
var csv = require("fast-csv");
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
  con.query("select vterminal_key,description,count(access.name) as count from kxcreporting.terminals "
    + "join access on access.terminal = terminals.vterminal_key "
    +"group by terminals.vterminal_key,terminals.description, access.terminal", function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
    res.send(result);
  });
});

router.get('/terminal_number/:id', function(req, res, next) {
  console.log(req.params.id);
  con.query("SELECT * FROM kxcreporting.access WHERE terminal = '"+req.params.id+"'", function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
    res.send(result);
  });
});
router.get('/get_file/', function (req,res,next) {
  var listdata = [];
  csv.fromPath("Xcore_Data/terminals.txt",{headers:true})
    .on("data", function(data){
      console.log(data);
      con.query("INSERT INTO `kxcreporting`.`terminals` (`description`, `vterminal_key`, `morpho_id`)" +
        "VALUES ('"+ data.DESCRIPTION +"', '"+ data.NAME_ +"', '"+ data.ID +"');"
        , function (err, result) {
          if (err) console.log(err);
          console.log("Result: " + JSON.stringify(result));
        });
      listdata.push(data);
    })
    .on("end", function() {
      console.log("done");
      fs.rename('Xcore_Data/terminals.txt', 'Xcore_Data/terminals-' + new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear() + '_' + new Date().getHours() + ':' + new Date().getMinutes() + '.txt', function (err) {
        if (err) throw err;
        console.log('renamed complete');
        res.json(listdata)
      });
    });
});
//{"NAME_":"Island 2 out 3","DESCRIPTION":"Island 2 out 3","LOCATION":"Island 2 out 3","ID":"61273AE0-B53D-4EAA-A52C-048458AC6B7E"}
// INSERT INTO `kxcreporting`.`terminals` (`description`) VALUES ('test');

module.exports = router;
