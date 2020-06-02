var PORT = process.env.PORT || 4000;
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var url = require('url');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const sqlite3 = require('sqlite3').verbose();

  app.get('/app/allusers', (req, res) => {
    let db = new sqlite3.Database('./food/LoginApp.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the chinook database.');
      });
       db.all(`select fname, lname from USER_INFO`, (err, results, fields) => {
          if (err) {
            res.sendStatus(400);
            console.error(err.message);
          }else{
            var rstring=JSON.stringify(results);
            var rjson =  JSON.parse(rstring);
            //res.json({
            //    fname: rjson[0].fname,
             //   lname: rjson[0].lname
            //});
            res.send(results);
          }
        });
      
      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Close the database connection.');
      });
});
app.listen(PORT, function () {
    console.log('service running on https://localhost/')
  })