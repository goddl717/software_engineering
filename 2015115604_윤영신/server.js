var express = require('express');
var app = express();
var mysql = require('mysql');

var dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'eorn',
    database: 'lms'
});
dbConnection.connect(); //db접속 //한번만.
app.get('/makesubject', function(req, res) {
    res.sendFile(__dirname + '/app/makesubject.html');
});

app.get('/login2', function(req, res) {
    res.sendFile(__dirname + '/app/login2.html');
});
app.get('/login1', function(req, res) {
    res.sendFile(__dirname + '/app/login1.html');
});
app.get('/main', function(req, res) {
    res.sendFile(__dirname + '/app/main.html');
});
app.get('/main2', function(req, res) {
    res.sendFile(__dirname + '/app/main2.html');
});
app.get('/suganglist', function(req, res) {
    res.sendFile(__dirname + '/app/suganglist.html');
});

app.get('/signup1', function(req, res) {
    res.sendFile(__dirname + '/app/signup1.html');
});

app.get('/signup2', function(req, res) {
    res.sendFile(__dirname + '/app/signup2.html');
});


app.get('/myroom', function(req, res) {
    res.sendFile(__dirname + '/app/myroom.html');
});

app.get('/myroom2', function(req, res) {
    res.sendFile(__dirname + '/app/myroom2.html');
});

app.get('/makesubjectproc', function(req, res) {

    var code = req.query.id;
    var name = req.query.name;
    var x = req.query.lat_input;
    var y = req.query.lng_input;
    var pid = req.query.pid
    var ran = "";

    var sql = 'INSERT INTO subject(id,name,x,y,randomnum,pid)VALUES(?,?,?,?,"",?)';

    var params = [code, name, x, y, pid];
    dbConnection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err);

        } else {
            console.log(rows.insertId);
            //res.send(rows);
            res.redirect("/main2?id=" + pid);
        }
    });
});

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

app.get('/lectureroom1', function(req, res) {
    res.sendFile(__dirname + '/app/lectureroom1.html');
});

app.get('/lectureroom2', function(req, res) {
    res.sendFile(__dirname + '/app/lectureroom2.html');
});

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

app.get('/login2proc', function(req, res) {
    var id = req.query.id;
    var password = req.query.password;

    //console.log(id);
    //console.log(password);
    //db 접속 시작
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

//교수단에서 출석 번호를 랜덤 생성할때 쓰는 것.
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

app.get('/finishcheck', function(req, res) {
    var code = req.query.code;
    var sql = 'UPDATE subject SET randomnum= ? WHERE id=?;';
    
    //console.log(num);
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

//학생단에서 출석번호를 불러올때 쓰는 것.
app.get('/load', function(req, res) {
    var code = req.query.code;
    var sql = 'select randomnum from subject WHERE id=?;';
    
    //console.log(num);
    //console.log(code);

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

app.get('/findlocation', function(req, res) {
    var code = req.query.code;
    var sql = 'SELECT * FROM subject where id="' + code + '";';

    //console.log("확인하기.");
    //console.log(req);
    //code = code.toString(); 
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

app.get('/login1proc', function(req, res) {
    var id = req.query.id;
    var password = req.query.password;

    //console.log(id);
    //console.log(password);
    //db 접속 시작
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

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

app.get('/asdf', function(req, res) {
    res.sendFile(__dirname + '/app/asdf.ejs');
});

var server = app.listen(8888, function() {
    console.log('load Success!');
});