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
    database: 'lms',
    multipleStatements: true
});

router.get('/', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;

    res.render('subjectroom', { id: id, code: code });
});

router.get('/announcement/content', function(req, res) {
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
            res.render('content', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
        }
    });
});

// 게시판 공용
router.get('/backAnnouncementList', function(req, res) {    // 공지사항 list로 돌아가면서 조회수 +
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
                res.redirect('/subjectroom/announcement?id=' + id + '&code=' + code);
            }else {
                res.redirect('/subjectroom/QnA?id=' + id + '&code=' + code);
            }
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
            res.render('announcement', { id: id, code: code, data: rows });
        }
    });
    console.log(temp);
});

router.get('/QnA', function(req, res) {
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
            res.render('QnA', { id: id, code: code, data: rows });
        }
    });
    console.log(temp);
});

router.get('/QnA/write', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var category = "QnA";
    var sql = 'SELECT name from student where id =' + id;   // QnA는 학생이 작성

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('write', { category: category, id: id, code: code, data: rows });
        }
    });
});

router.get('/QnA/content', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var views = req.query.views;
    var existReply = req.query.reply;                      // 답변 유무 (1 or 0)
    var existComment = parseInt(req.query.existComment);   // 댓글 개수
    var category = "QnA";
    var sql = 'SELECT * FROM board where idx ="' + idx + '";' +     // comment 때문에 packet index 뒤로 하나 보낼려고
              'SELECT * FROM board where idx ="' + idx + '";' +     //
              'SELECT * FROM board where idx ="' + idx + '";' +
              'SELECT name from student where id="' + id + '";';
    if(existReply==1)
        sql += 'SELECT * FROM board_reply where idx =' + idx + ';';
    if(existComment>0)
        sql += 'SELECT * FROM board_comments where idx =' + idx;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            if(existReply==1 && existComment==0){
                console.log(1);
                res.render('content_qna_reply', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }else if (existReply==0 && existComment>0){
                console.log(2);
                res.render('content_qna_comment', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }else if (existReply==1 && existComment>0){
                console.log(3);
                res.render('content_qna_reply_comment', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }else{
                console.log(4);
                res.render('content_qna', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }  
        }
    });
});

router.get('/comment', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    
    var views = req.query.views;
    var commenterName = req.query.name;
    var category = "QnA";
    var comments = req.query.comments;
    var existReply = req.query.existReply;
    var existComment = req.query.existComment;  
    existComment = parseInt(existComment) + 1;  // 댓글 하나 추가

    var sql = 'INSERT INTO board_comments(idx, commenterId, commenterName, comments) VALUES(?,?,?,?);';
    params = [idx, id, commenterName, comments];
        sql += 'UPDATE board SET C_exist=' + existComment + ' where idx=' + idx + ';';    
        sql += 'SELECT * FROM board where idx ="' + idx + '";' +   
               'SELECT name from student where id="' + id + '";';
    if(existReply==1)
        sql += 'SELECT * FROM board_reply where idx =' + idx + ';';
    if(existComment>0)
        sql += 'SELECT * FROM board_comments where idx =' + idx + ';';    

    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            if(existReply==1 && existComment==0){
                console.log(1);
                res.render('content_qna_reply', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }else if (existReply==0 && existComment>0){
                console.log(2);   
                res.render('content_qna_comment', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }else if (existReply==1 && existComment>0){
                console.log(3);
                res.render('content_qna_reply_comment', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }else{
                console.log(4);
                res.render('content_qna', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }    
        }
    });
});

// 질문 삭제
router.get('/delete', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;

    var sql = 'delete from board where idx =' + idx;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.redirect('/subjectroom/QnA?id=' + id + '&code=' + code);
        }
    });
});

// 댓글 삭제
router.get('/deleteComment', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    
    var views = req.query.views;
    var commenterName = req.query.name;
    var category = "QnA";
    var comments = req.query.comments;
    var existReply = req.query.existReply;
    var existComment = req.query.existComment;  
    existComment = parseInt(existComment) - 1;  // 댓글 하나 삭제
    var Cnum = req.query.Cnum;

    var sql = 'DELETE FROM board_comments where Cnum = ' + Cnum + ';';
    params = [idx, id, commenterName, comments];
        sql += 'UPDATE board SET C_exist=' + existComment + ' where idx=' + idx + ';';    
        sql += 'SELECT * FROM board where idx ="' + idx + '";' +   
               'SELECT name from student where id="' + id + '";';
    if(existReply==1)
        sql += 'SELECT * FROM board_reply where idx =' + idx + ';';
    if(existComment>0)
        sql += 'SELECT * FROM board_comments where idx =' + idx + ';';    

    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            if(existReply==1 && existComment==0){
                console.log(1);
                res.render('content_qna_reply', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }else if (existReply==0 && existComment>0){
                console.log(2);   
                res.render('content_qna_comment', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }else if (existReply==1 && existComment>0){
                console.log(3);
                res.render('content_qna_reply_comment', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }else{
                console.log(4);
                res.render('content_qna', { category: category, id: id, code: code, idx: idx, views: views, data: rows });
            }    
        }
    });
});

// 질문 글 수정
router.get('/update', function(req, res) {
    var id = req.query.id;
    var code = req.query.code;
    var idx = req.query.idx;
    var category = "QnA";
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
    var content = req.query.content;
    var title = req.query.title;

    var sql = 'UPDATE board SET content="' + content + '",title="' + title + '" where idx =' + idx;

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.redirect('/subjectroom/QnA?id=' + id + '&code=' + code);
        }
    });
});

module.exports = router;
