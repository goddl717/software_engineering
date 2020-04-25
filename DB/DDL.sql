CREATE TABLE student(
    id varchar(25),
    password varchar(25),
    name varchar(25),
    major varchar(25)
);

CREATE TABLE professor(
    id varchar(25),
    password varchar(25),
    name varchar(25),
    major varchar(25)
);

CREATE TABLE subject(
    id varchar(25),
    name varchar(25),
    x INT,
    y INT,
    randomnum varchar(25),
    pid varchar(25)
);

CREATE TABLE sugang(
    id varchar(25),
    stu varchar(25)
);
