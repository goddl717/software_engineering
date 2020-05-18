var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');

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
    database: 'lms',
    multipleStatements: true
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

router.get('/announcement2/content2', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var views = req.query.views;
    var category = "announcement";
    var sql = 'SELECT * FROM board where idx ="' + idx + '";';
    console.log(sql);

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('content2', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
        }
    });
});

// 게시판 공용
router.get('/backAnnouncementList2', function(req, res) {    // 공지사항 list로 돌아가면서 조회수 +
    var category = req.query.category;
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
            if(category == "announcement"){
                res.redirect('/subjectroom2/announcement2?id=' + id + '&code=' + code);
            }else {
                res.redirect('/subjectroom2/QnA2?id=' + id + '&code=' + code);
            }
        }
    });
});

//비디오 list
router.get('/videolist', function(req, res) {

    var code = req.query.code;
    var id = req.query.id;
    console.log(code);
    console.log(id);
    
    var sql = 'select * from video where code = "' + code + '"';
    console.log(sql);

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('videolist', { data: rows, id : id, code:code  });
        }
    });
});

//파일 업로드 
router.post('/uploadvideo', upload.single("videoFile"),function(req, res) {
    var id = req.body.id;
    var code = req.body.code;
    var path = (req.file.path).toString();

    console.log(req.file);
    console.log(path);
    console.log(id);
    console.log(code);

    var sql = 'insert into video(code,date,path) values(?,curdate(),?)';
    var param = [code,path];
    dbConnection.query(sql,param, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/subjectroom2/videolist?id=${id}&code=${code}`);
        }
    });
});
//비디오삭제
router.post('/deleteVid', function(req,res){
    var id = req.body.id;
    var code = req.body.code;
    var idx = req.body.idx;
    
    var sql = `delete from video where idx = "${idx}";`+` alter table video AUTO_INCREMENT=1;`+` SET @COUNT = 0;`+` UPDATE video SET video.idx = @COUNT:=@COUNT+1;`+`alter table video AUTO_INCREMENT=${idx}`;
    dbConnection.query(sql, function(err, rows,fields) {
        if (err) {
            console.log(err);
        } else {
            fs.unlink(`${req.body.path}`,function(err){
                if(err){
                    console.log(err);
                    alert("통신실패!!");
                }
                else{
                    console.log("deleted");
                }
            });
            res.redirect(`/subjectroom2/videolist?id=${id}&code=${code}`);
        }
    });
});

router.get('/announcement2/write', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var category = "announcement";
    var sql = 'SELECT name from professor where id =' + id;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('write', { category: category, id: id, code: code, data: rows });
        }
    });
});

// 학생, 교수 공용
router.get('/writeProc', function(req, res) {   
    var category = req.query.category;
    var id = req.query.id;
    var code = req.query.code;
    var name = req.query.name;
    var title = req.query.title;
    var content = req.query.content;

    var sql = 'INSERT INTO board(category, code,id,name,title,content) VALUES(?,?,?,?,?,?)';

    params = [category, code, id, name, title, content, 0];
    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows.insertId);
            if(category == "announcement"){
                res.redirect('/subjectroom2/announcement2?id=' + id + '&code=' + code);
            }else {
                res.redirect('/subjectroom/QnA?id=' + id + '&code=' + code);
            }
        }
    });
})

router.get('/QnA2', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var sql = 'SELECT @rownum := @rownum+1 AS ROWNUM, B.* \
                FROM board AS B, (SELECT @rownum:=0) N \
                where code = "' + code + '" AND category = "QnA" \
                order by ROWNUM desc';
    console.log(sql);
    var temp;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            temp = JSON.stringify(rows);
            res.render('QnA2', { id: id, code: code, data: rows });
        }
    });
    console.log(temp);
});

router.get('/QnA2/content2', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var views = req.query.views;
    var category = "QnA";
    var sql = 'SELECT * FROM board where idx ="' + idx + '";';
    console.log(sql);

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('content_qna2', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
        }
    });
});
  

module.exports = router;
