CREATE TABLE student
(
    id varchar(25),
    password varchar(25),
    name varchar(25),
    major varchar(25)
    primary key (id)
);

CREATE TABLE professor
(
    id varchar(25),
    password varchar(25),
    name varchar(25),
    major varchar(25)
    primary key (id)
);

CREATE TABLE subject
(
    id varchar(25),
    name varchar(25)
    primary key (id)
);

CREATE TABLE sugang
(
    id varchar(25),
    stu varchar(25)
    primary key (id)
);

CREATE TABLE board(
    idx int(11) not null AUTO_INCREMENT,
    category varchar(25),
    code varchar(25),
    id varchar(25),
    name varchar(25),
    title varchar(50),
    content mediumtext,
    regdate datetime not null default current_timestamp,
    views int default 1,
    reply mediumtext,       -- QnA 전용 답변
    comments varchar(50),   -- 댓글
    primary key (idx)
)
DEFAULT character set = utf8;

CREATE TABLE attendace
(
    code varchar(25),
    sid varchar(25),
    date date
    primary key (code)
);

-- incomplete..
CREATE TABLE video(
    code varchar(25)
);
