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

CREATE TABLE note
(
num int NOT NULL AUTO_INCREMENT primary key,
code varchar(25),
title varchar(25),
content varchar(25),
views int
);

CREATE TABLE board(
    idx int(11) not null AUTO_INCREMENT,
    code varchar(25),
    name varchar(25),
    title varchar(50),
    content mediumtext,
    regdate datetime not null default current_timestamp,
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