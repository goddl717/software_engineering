var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var moment = require('moment');

//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'videos/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

var dbConnection = mysql.createConnection({
    host: 'localhost',
    //user: 'root',
    //password: 'qwerty1234',
    user: 'sunwoo',
    password: 'Sunwoo123!',
    database: 'lms',
    multipleStatements: true
});


router.get('/', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;

    res.render('subjectroom2', { id: id, code: code });
});

router.get('/announcement2', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var sql = 'SELECT @rownum := @rownum+1 AS ROWNUM, B.* \
               FROM board AS B, (SELECT @rownum:=0) N \
               where code = "' + code + '" AND category = "announcement" \
               order by ROWNUM desc';
    console.log(sql);
    var temp;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            temp = JSON.stringify(rows);
            res.render('announcement2', { id: id, code: code, moment: moment, data: rows });
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
router.get('/backAnnouncementList2', function(req, res) { // 공지사항 list로 돌아가면서 조회수 +
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
            if (category == "announcement") {
                res.redirect('/subjectroom2/announcement2?id=' + id + '&code=' + code);
            } else {
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
            res.render('videolist', { data: rows, id: id, code: code });
        }
    });
});

//파일 업로드 
router.post('/uploadvideo', upload.single("videoFile"), function(req, res) {
    var id = req.body.id;
    var code = req.body.code;
    var path = (req.file.path).toString();

    console.log(req.file);
    console.log(path);
    console.log(id);
    console.log(code);

    var sql = 'insert into video(code,date,path) values(?,curdate(),?)';
    var param = [code, path];
    dbConnection.query(sql, param, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/subjectroom2/videolist?id=${id}&code=${code}`);
        }
    });
});
//비디오삭제
router.post('/deleteVid', function(req, res) {
    var id = req.body.id;
    var code = req.body.code;
    var idx = req.body.idx;

    var sql = `delete from video where idx = "${idx}";` + ` alter table video AUTO_INCREMENT=1;` + ` SET @COUNT = 0;` + ` UPDATE video SET video.idx = @COUNT:=@COUNT+1;` + `alter table video AUTO_INCREMENT=${idx}`;
    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            fs.unlink(`${req.body.path}`, function(err) {
                if (err) {
                    console.log(err);
                    alert("통신실패!!");
                } else {
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
            if (category == "announcement") {
                res.redirect('/subjectroom2/announcement2?id=' + id + '&code=' + code);
            } else {
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
            res.render('QnA2', { id: id, code: code, moment: moment, data: rows });
        }
    });
    console.log(temp);
});

router.get('/QnA2/content2', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var views = req.query.views;
    var existReply = req.query.reply; // 답변 유무 (1 or 0)
    var existComment = parseInt(req.query.existComment); // 댓글 개수
    var category = "QnA";
    var sql = 'SELECT * FROM board where idx ="' + idx + '";' + // comment 때문에 packet index 뒤로 하나 보낼려고
        'SELECT * FROM board where idx ="' + idx + '";' + //
        'SELECT * FROM board where idx ="' + idx + '";' +
        'SELECT name from professor where id="' + id + '";';
    if (existReply == 1)
        sql += 'SELECT * FROM board_reply where idx =' + idx + ';';
    if (existComment > 0)
        sql += 'SELECT * FROM board_comments where idx =' + idx;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            if (existReply == 1 && existComment == 0) {
                console.log(1);
                res.render('content_qna2_reply', { category: category, id: id, code: code, idx: idx, views: views, moment: moment, data: rows });
            } else if (existReply == 0 && existComment > 0) {
                console.log(2);
                res.render('content_qna2_comment', { category: category, id: id, code: code, idx: idx, views: views, moment: moment, data: rows });
            } else if (existReply == 1 && existComment > 0) {
                console.log(3);
                res.render('content_qna2_reply_comment', { category: category, id: id, code: code, idx: idx, views: views, moment: moment, data: rows });
            } else {
                console.log(4);
                res.render('content_qna2', { category: category, id: id, code: code, idx: idx, views: views, moment: moment, data: rows });
            }
        }
    });
});

router.get('/comment2', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var views = req.query.views;
    var commenterName = req.query.name;
    var category = "QnA";
    var comments = req.query.comments;
    var existReply = req.query.existReply;
    var existComment = req.query.existComment;
    existComment = parseInt(existComment) + 1; // 댓글 하나 추가

    var sql = 'INSERT INTO board_comments(idx, commenterId, commenterName, comments) VALUES(?,?,?,?);';
    params = [idx, id, commenterName, comments];
    sql += 'UPDATE board SET C_exist=' + existComment + ' where idx=' + idx + ';';
    sql += 'SELECT * FROM board where idx ="' + idx + '";' +
        'SELECT name from professor where id="' + id + '";';
    if (existReply == 1)
        sql += 'SELECT * FROM board_reply where idx =' + idx + ';';
    if (existComment > 0)
        sql += 'SELECT * FROM board_comments where idx =' + idx + ';';

    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            if (existReply == 1 && existComment == 0) {
                console.log(1);
                res.render('content_qna2_reply', { category: category, id: id, code: code, idx: idx, views: views, moment: moment, data: rows });
            } else if (existReply == 0 && existComment > 0) {
                console.log(2);
                res.render('content_qna2_comment', { category: category, id: id, code: code, idx: idx, views: views, moment: moment, data: rows });
            } else if (existReply == 1 && existComment > 0) {
                console.log(3);
                res.render('content_qna2_reply_comment', { category: category, id: id, code: code, idx: idx, views: views, moment: moment, data: rows });
            } else {
                console.log(4);
                res.render('content_qna2', { category: category, id: id, code: code, idx: idx, views: views, moment: moment, data: rows });
            }
        }
    });
});

// 교수 답변
router.get('/reply', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var reply = req.query.reply;
    var idx = req.query.idx;
    var name = req.query.name; // 교수 이름
    var update = req.query.update;

    if (reply == null) {
        console.log("There was no reply.");
    }

    var sql = 'INSERT INTO board_reply(idx, replierId, replierName, reply) VALUES(?,?,?,?);';
    if (update == 0)
        sql += 'UPDATE board set R_exist=' + true + ' where idx=' + idx; // reply 존재한다고 update
    else // 답변 수정
        sql += 'UPDATE board_reply set reply="' + reply + '" where idx=' + idx;
    params = [idx, id, name, reply];

    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows.insertId);
            res.redirect('/subjectroom2/QnA2?id=' + id + '&code=' + code);
        }
    });
})

router.get('/delete', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var category = req.query.category;

    var sql = 'delete from board where idx =' + idx;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            if (category == "announcement") {
                res.redirect('/subjectroom2/announcement2?id=' + id + '&code=' + code);
            } else {
                res.redirect('/subjectroom2/QnA2?id=' + id + '&code=' + code);
            }
        }
    });
});

router.get('/announcement2/update', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var category = "announcement";
    var sql = 'SELECT content, title from board where idx =' + idx;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('update', { category: category, idx: idx, id: id, code: code, data: rows });
        }
    });
});

router.get('/updateProc', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var category = req.query.category;
    var content = req.query.content;
    var title = req.query.title;

    var sql = 'UPDATE board SET content="' + content + '",title="' + title + '" where idx =' + idx;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            if (category == "announcement") {
                res.redirect('/subjectroom2/announcement2?id=' + id + '&code=' + code);
            } else {
                res.redirect('/subjectroom2/QnA2?id=' + id + '&code=' + code);
            }
        }
    });
});

module.exports = router;