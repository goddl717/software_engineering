var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'eorn',
    database: 'lms'
});


router.get('/', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var sql = 'SELECT * FROM note where code ="' + code + '";';
    console.log(sql);
    var temp;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            temp = JSON.stringify(rows);
            // console.log(temp);
            res.render('videoroom', { id: id, code: code, data: rows });
        }
    });
    console.log(temp);
});


module.exports = router;