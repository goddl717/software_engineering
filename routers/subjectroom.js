var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var multer = require('multer');
var upload = multer({ dest: "/videos" });

var dbConnection = mysql.createConnection({
    host: 'localhost',
    // user: 'root',
    // password: 'eorn',
    user: 'sunwoo',
    password: 'Sunwoo123!',
    database: 'lms'
});


router.get('/', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var sql = 'SELECT * FROM board where code ="' + code + '";';
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

router.get('/announcement/content', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var views = req.query.views;
    var sql = 'SELECT * FROM board where idx ="' + idx + '";';
    console.log(sql);

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('content', { id: id, code: code, idx: idx, views: views, data: rows });
        }
    });
});

router.get('/backAnnouncementList', function(req, res) {    // 공지사항 list로 돌아가면서 조회수 +
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var views = req.query.views;
    views = parseInt(views);

    var sql = 'update board set views =' + (views + 1) + ' where idx =' + idx;
    console.log(sql);

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.redirect('/subjectroom/announcement?id=' + id + '&code=' + code);
        }
    });
});

router.get('/videolist', function(req, res) {

    var code = req.query.code;
    var id = req.query.id;

    console.log(code)
    console.log(id)

    var sql = 'select * from video where code = "' + code + '"';
    console.log(sql);

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('videolist2', { data: rows, id: id, code:code });
        }
    });
});

router.get('/announcement', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var sql = 'SELECT * FROM board where code ="' + code + '";';
    console.log(sql);
    var temp;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            temp = JSON.stringify(rows);
            res.render('announcement', { id: id, code: code, data: rows });
        }
    });
    console.log(temp);
});


module.exports = router;
