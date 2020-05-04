var express = require('express');
var app = express();
var mysql = require('mysql');
//DB 연결 정보
var dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'sunwoo',
    password: 'Sunwoo123!',
    database: 'lms'
});
//DB 연결
dbConnection.connect();

//메인 화면
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});
//강의 개설
app.get('/makesubject', function(req, res) {
    res.sendFile(__dirname + '/app/makesubject.html');
});
//강의 개설에 대한 처리
app.get('/makesubjectproc', function(req, res) {

    var code = req.query.id;
    var name = req.query.name;
    var x = req.query.lat_input;
    var y = req.query.lng_input;
    var pid = req.query.pid

    var sql = 'INSERT INTO subject(id,name,x,y,randomnum,pid)VALUES(?,?,?,?,"",?)';

    var params = [code, name, x, y, pid];
    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows.insertId);
            res.redirect("/main2?id=" + pid);
        }
    });
});
//학생 로그인
app.get('/login1', function(req, res) {
    res.sendFile(__dirname + '/app/login1.html');
});
//학생 로그인 처리
app.get('/login1proc', function(req, res) {
    var id = req.query.id;
    var password = req.query.password;
    var sql = 'SELECT * FROM student ' + 'where id =\'' + id + '\' and password = \'' + password + '\'';
    
    console.log(sql);
    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
            res.end();
        }
    });
});
//교원 로그인
app.get('/login2', function(req, res) {
    res.sendFile(__dirname + '/app/login2.html');
});
//교원 로그인 처리
app.get('/login2proc', function(req, res) {
    var id = req.query.id;
    var password = req.query.password;
    var sql = 'SELECT * FROM professor ' + 'where id =\'' + id + '\' and password = \'' + password + '\'';
    
    console.log(sql);
    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
            res.end();
        }
    });
});
//학생 메인
app.get('/main', function(req, res) {
    res.sendFile(__dirname + '/app/main.html');
});
//교원 메인
app.get('/main2', function(req, res) {
    res.sendFile(__dirname + '/app/main2.html');
});
//수강 신청 가능 목록 (학생)
app.get('/suganglist', function(req, res) {
    res.sendFile(__dirname + '/app/suganglist.html');
});
//수강 신청 가능 목록에 대한 처리
app.get('/suganglistproc', function(req, res) {
    var sql = 'SELECT * FROM subject';
    
    console.log(sql);

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
            res.end();
        }
    });
});
//수강 신청 처리
app.get('/enrollproc', function(req, res) {
    var id = req.query.id;
    var stu = req.query.stu;
    var sql = 'INSERT INTO sugang(id,stu)VALUES(?,?)';
    var params = [id, stu];

    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows.insertId);
            res.send(rows);
        }
    });
});
//학생 회원가입
app.get('/signup1', function(req, res) {
    res.sendFile(__dirname + '/app/signup1.html');
});
//학생 회원가입에 대한 처리
app.get('/signup1proc', function(req, res) {
    var id = req.query.id;
    var password = req.query.password;
    var major = req.query.major;
    var name = req.query.name;
    var sql = 'INSERT INTO student(id,password,major,name)VALUES(?,?,?,?)';
    var params = [id, password, major, name];

    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.redirect('/signup1');
        } else {
            console.log(rows.insertId);
            res.redirect('/main?id=' + id);
        }
    });
});
//교원 회원가입
app.get('/signup2', function(req, res) {
    res.sendFile(__dirname + '/app/signup2.html');
});
//교원 회원가입에 대한 처리
app.get('/signup2proc', function(req, res) {
    var id = req.query.id;
    var password = req.query.password;
    var major = req.query.major;
    var name = req.query.name;
    var sql = 'INSERT INTO professor(id,password,major,name)VALUES(?,?,?,?)';
    var params = [id, password, major, name];

    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.redirect('/signup2');
        } else {
            console.log(rows.insertId);
            res.redirect('/main2?id=' + id);
        }
    });
});
//수강 신청한 목록 (학생)
app.get('/myroom', function(req, res) {
    res.sendFile(__dirname + '/app/myroom.html');
});
//수강 신청한 목록에 대한 처리
app.get('/myroomproc', function(req, res) {
    var id = req.query.id;
    var sql = 'SELECT * FROM sugang sug, subject sub ' + 'where sug.stu =' + id + ' and sug.id =sub.id';

    console.log(sql);
    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
            res.end();
        }
    });
});
//개설한 강의 목록 (교수)
app.get('/myroom2', function(req, res) {
    res.sendFile(__dirname + '/app/myroom2.html');
});
//개설한 강의 목록에 대한 처리
app.get('/myroomproc2', function(req, res) {
    var id = req.query.id;
    var sql = 'SELECT * FROM subject where pid =' + id + ';';

    console.log(sql);
    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
            res.end();
        }
    });
});
//강의실 입장 (학생)
app.get('/lectureroom1', function(req, res) {
    res.sendFile(__dirname + '/app/lectureroom1.html');
});
//현재 위치 확인
app.get('/findlocation', function(req, res) {
    var code = req.query.code;
    var sql = 'SELECT * FROM subject where id="' + code + '";';

    console.log(sql);

    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
            res.end();
        }
    });
});
//출석 체크 번호 확인
app.get('/load', function(req, res) {
    var code = req.query.code;
    var sql = 'select randomnum from subject WHERE id=?;';
    
    dbConnection.query(sql, [code], function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
            res.end();
        }
    });
});
//출석 처리
app.get('/attendance', function(req, res) {
    var code = req.query.code;
    var sid = req.query.sid;
    var sql = 'INSERT INTO attendance(code,sid,date)VALUES(?,?,curdate())';
    var params = [code, sid];

    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows.insertId);
            res.send(rows);
        }
    });
});
//강의실 입장 (교수)
app.get('/lectureroom2', function(req, res) {
    res.sendFile(__dirname + '/app/lectureroom2.html');
});
//출석 시 강의실 위치 변경 (교수)
app.get('/updatelocationproc', function(req, res) {
    var x = req.query.lat_input;
    var y = req.query.lng_input;
    var code = req.query.code_input;
    var id = req.query.pid_input

    var sql = 'UPDATE subject SET x=' + x + ', y=' + y +' where id=\'' + code + '\';';
    dbConnection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.redirect("/lectureroom2?id=" + id + "&code=" + code);
        }
    });
});
//출석 번호 랜덤 생성
app.get('/loadnumber', function(req, res) {
    var code = req.query.code;
    var num = Math.floor(Math.random() * (1000)) + 1;
    var sql = 'UPDATE subject SET randomnum= ? WHERE id=?;';
    
    console.log(num);
    console.log(code);

    dbConnection.query(sql, [num, code], function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
            res.end();
        }
    });
});
//출석 체크 종료
app.get('/finishcheck', function(req, res) {
    var code = req.query.code;
    var sql = 'UPDATE subject SET randomnum= ? WHERE id=?;';
    
    console.log(code);
    dbConnection.query(sql, [" ", code], function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
            res.end();
        }
    });
});
//Facebook 계정 연동
app.get('/connectsns', function(req, res) {
    res.sendFile(__dirname + '/app/connectsns.html');
})
//미확인
app.get('/asdf', function(req, res) {
    res.sendFile(__dirname + '/app/asdf.ejs');
});
//서버 기동
var server = app.listen(8888, function() {
    console.log('load Success!');
});