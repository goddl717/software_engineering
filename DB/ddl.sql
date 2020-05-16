CREATE TABLE student
(
id varchar(25),
password varchar(25),
name varchar(25),
major varchar(25)
);

CREATE TABLE professor
(
id varchar(25),
password varchar(25),
name varchar(25),
major varchar(25)
);

CREATE TABLE subject
(
id varchar(25),
name varchar(25)
);


CREATE TABLE sugang
(
id varchar(25),
stu varchar(25)
);

CREATE TABLE board(
    idx int(11) not null AUTO_INCREMENT,
    code varchar(25),
    name varchar(25),
    title varchar(50),
    content mediumtext,
    regdate datetime not null default current_timestamp,
    views int default 1,
    primary key (idx)
)
DEFAULT character set = utf8;

CREATE TABLE attendace
(
code varchar(25),
sid varchar(25),
date date
);

-- insert into note(title,content,views) value("제목","내용",1);