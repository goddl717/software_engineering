CREATE TABLE student
(
    id varchar(25),
    password varchar(25),
    name varchar(25),
    major varchar(25),
    primary key (id)
);

CREATE TABLE professor
(
    id varchar(25),
    password varchar(25),
    name varchar(25),
    major varchar(25),
    primary key (id)
);

CREATE TABLE subject
(
    id varchar(25),
    name varchar(25),
    x double,
    y double, 
    randomnum varchar(25),
    pid varchar(25)
);

CREATE TABLE sugang
(
    id varchar(25),
    stu varchar(25),
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
    C_exist int default 0,
    R_exist boolean default false,
    primary key (idx)
)
DEFAULT character set = utf8;

-- 댓글
CREATE TABLE board_comments(
    idx int(11) not null,
    Cnum int(11) not null AUTO_INCREMENT,
    commenterId varchar(25),
    commenterName varchar(25),
    comments varchar(50),
    commentsDate datetime not null default current_timestamp,
    primary key (Cnum),
    FOREIGN KEY (idx) REFERENCES board(idx) ON UPDATE CASCADE ON DELETE CASCADE
)
DEFAULT character set = utf8;

-- QnA 답변 (교수)
CREATE TABLE board_reply(
    idx int(11) not null,
    Rnum int(11) not null AUTO_INCREMENT,
    replierId varchar(25),
    replierName varchar(25),
    reply mediumtext not null ,
    replyDate datetime not null default current_timestamp,
    primary key (Rnum),
    FOREIGN KEY (idx) REFERENCES board(idx) ON UPDATE CASCADE ON DELETE CASCADE
)
DEFAULT character set = utf8;

CREATE TABLE attendance
(
    code varchar(25),
    sid varchar(25),
    date date,
    primary key (code)
);

-- incomplete
CREATE TABLE video(
    idx int(11) not null AUTO_INCREMENT primary key,
    code varchar(25),
    date date,
    path varchar(255)
);
