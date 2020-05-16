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
            res.render('subjectroom2', { id: id, code: code, data: rows });
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

router.get('/backAnnouncementList2', function(req, res) {    // 공지사항 list로 돌아가면서 조회수 +
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
            res.redirect('/subjectroom2/announcement2?id=' + id + '&code=' + code);
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
    var id = req.body.id;
    var code = req.body.code;
    console.log(req.file);
    
    var sql = 'insert into video(code)values(?)';
    dbConnection.query(sql,code, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/subjectroom2/videolist?id=${id}&code=${code}`);
        }
    });
});

router.get('/announcement2', function(req, res) {
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
            res.render('announcement2', { id: id, code: code, data: rows });
        }
    });
    console.log(temp);
});

router.get('/announcement2/write', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var sql = 'SELECT name from professor where id =' + id;

    // res.render('write', { id: id, code: code });

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('write', { id: id, code: code, data: rows });
        }
    });
});

router.get('/writeProc', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var name = req.query.name;
    var title = req.query.title;
    var content = req.query.content;
    console.log("id: " + id);

    var sql = 'INSERT INTO board(code,name,title,content) VALUES(?,?,?,?)';

    params = [code, name, title, content, 0];
    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows.insertId);
            res.redirect('/subjectroom2/announcement2?id=' + id + '&code=' + code);
        }
    });
})
  

module.exports = router;
