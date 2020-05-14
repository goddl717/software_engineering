var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'videos/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

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
            res.render('subjectroom2', { id: id, code: code, data: rows });
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
            res.redirect('/subjectroom2/content?id=' + id + '&code=' + code + '&num=' + num);
        }
    });
});


router.get('/uploadnoteproc', function(req, res) {
    var title = req.query.title;
    var content = req.query.content;
    var code = req.query.code;
    var id = req.query.id;

    console.log(title)
    console.log(content)

    var sql = 'INSERT INTO note(code,title,content,views)VALUES(?,?,?,?)';
    console.log(sql);

    params = [code, title, content, 1];
    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows.insertId);
            res.redirect('/subjectroom2?id=' + id + '&code=' + code);
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
            res.render('videolist', { data: rows });
        }
    });
});
//파일 업로드 
router.post('/uploadvideo', upload.single("videoFile"),function(req, res) {
    //res.render();
    //res.redirect();
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
            // console.log(temp);
            res.render('announcement', { id: id, code: code, data: rows });
        }
    });
    console.log(temp);
});

router.get('/write', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var temp;
    res.render('write', { id: id, code: code });
});


module.exports = router;
