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
            res.render('subjectroom', { id: id, code: code, data: rows });
        }
    });
    console.log(temp);
});


router.get('/content', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var temp;
    res.render('content', { id: id, code: code });

});

router.get('/viewplus', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var num = req.query.num;
    var view = req.query.view;

    console.log("view추가");
    console.log(id)
    console.log(code)
    console.log(num)
    console.log(view)


    view = parseInt(view);

    var sql = 'update note set views =' + (view + 1) + ' where num =' + num;
    console.log(sql);

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.redirect('/subjectroom/content?id=' + id + '&code=' + code + '&num=' + num);
        }
    });
});


router.get('/uploadnoteproc', function(req, res) {
    var title = req.query.title;
    var content = req.query.comment;
    var code = req.query.code;


    console.log(title)
    console.log(comment)



    var sql = 'INSERT INTO note(code,title,content,views)VALUES(?,?,?,?)';
    console.log(sql);

    params = [code, title, content, 1];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows.insertId);
            res.redirect('/subjectroom?id=' + id + '&code=' + code + '&num=' + num);
        }
    });

});


module.exports = router;