var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var csv = require("fast-csv");
var fs = require("file-system");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "infoware",
  database: "kxcreporting"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  con.query("select * from kxcreporting.users", function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
    res.send(result);
  });
});
router.get('/get_file/', function (req,res,next) {
  var listdata = [];
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
      fs.rename('Xcore_Data/all_users.txt', 'Xcore_Data/all_users-'+new Date().getDate()+'-'+new Date().getMonth()+'-'+new Date().getFullYear()+'_'+new Date().getHours()+':'+new Date().getMinutes()+'.txt', function (err) {
        if (err) throw err;
      console.log('renamed complete');
        res.json(listdata)
    });
    });
});
// {"Surname":"Khayelihle",
//   "LastName":"Nene",
//   "DateOfBirth":"1899-12-31 22:00:00.000",
//   "CardNumber":"36779",
//   "Company":"",
//   "ID":"7B2B379C-8B99-489A-AF42-000874B1C954",
//   "Created":"2016-11-04 01:17:28.100",
//   "Modified":"2016-11-27 10:17:58.587"}
// INSERT INTO `kxcreporting`.`userdetails` (`id`, `uf5`, `uf36`, `uf37`, `uf16`, `uf2`, `sbiid`)
// VALUES ('card_number', 'name+surname');
module.exports = router;
