-- student 1 / 1
-- professor 11 / 11
-- 게시판은 Software Engineering 사용


-- student
insert into student values(1,1, '홍길동', 'computer science');
insert into student values(2013105104,1234, '허영행', 'computer science');
insert into student values(2014104286,1234, '장선우', 'computer science');
insert into student values(2017107111,1234, '윤영신', 'computer science');
insert into student values(2016107222,1234, '김정구', 'computer science');
insert into student values(2016107333,1234, '김종훈', 'computer science');

-- professor
insert into professor values(11, 11, '정설영', 'computer science');
insert into professor values(2, 2, '박영철', 'computer science');
insert into professor values(3, 3, '탁병철', 'computer science');
insert into professor values(4, 4, '김항준', 'computer science');
insert into professor values(5, 5, '김정홍', 'computer science');
insert into professor values(6, 6, '유관우', 'computer science');



-- subject
insert into subject(id,name,x,y,pid) values('COMP104', 'Software Engineering', 35, 128, 1);
insert into subject(id,name,x,y,pid) values('COMP203', 'Big Data Basic', 35, 128, 1);
insert into subject(id,name,x,y,pid) values('COMP204', 'Baisc Programming', 35, 128, 1);


insert into subject(id,name,x,y,pid) values('COMP114', 'Algorithm1', 35, 128, 6);
insert into subject(id,name,x,y,pid) values('COMP115', 'C++ language', 35, 128, 6);
insert into subject(id,name,x,y,pid) values('COMP116', 'Algorithm2', 35, 128, 6);



insert into subject(id,name,x,y,pid) values('COMP331', 'Data Structure', 35, 128, 5);
insert into subject(id,name,x,y,pid) values('COMP332', 'Data Structure Programming', 35, 128, 5);
insert into subject(id,name,x,y,pid) values('COMP333', 'System Programming', 35, 128, 5);
insert into subject(id,name,x,y,pid) values('COMP334', 'Network Programming', 35, 128, 5);


insert into subject(id,name,x,y,pid) values('COMP401', 'Digital Art Media', 35, 128, 4);

insert into subject(id,name,x,y,pid) values('COMP305', 'Digital Art Media', 35, 128, 2);
insert into subject(id,name,x,y,pid) values('COMP306', 'Computer Structure', 35, 128, 2);
insert into subject(id,name,x,y,pid) values('COMP307', 'Java Programming', 35, 128, 2);
insert into subject(id,name,x,y,pid) values('COMP308', 'Automata', 35, 128, 2);






-- sugang
insert into sugang values('COMP104', 1);
insert into sugang values('COMP114', 1);


insert into sugang values('COMP401', 2013105104);
insert into sugang values('COMP114', 2013105104);
insert into sugang values('COMP305', 2013105104);
insert into sugang values('COMP306', 2013105104);
insert into sugang values('COMP307', 2013105104);
insert into sugang values('COMP308', 2013105104);

insert into sugang values('COMP401', 2017107111);
insert into sugang values('COMP114', 2017107111);
insert into sugang values('COMP305', 2017107111);
insert into sugang values('COMP306', 2017107111);
insert into sugang values('COMP307', 2017107111);
insert into sugang values('COMP308', 2017107111);

insert into sugang values('COMP308', 2016107333);
insert into sugang values('COMP114', 2016107333);
insert into sugang values('COMP305', 2016107333);
insert into sugang values('COMP306', 2016107333);
insert into sugang values('COMP307', 2016107333);
insert into sugang values('COMP308', 2016107333);





- baord
insert into board(category,code,id,name,title,content) 
       values ('announcement','COMP104',11,'정설영','test','test');
insert into board(category,code,id,name,title,content) 
       values ('QnA','COMP104',1,'홍길동','질문만','test');
insert into board(category,code,id,name,title,content, R_exist) 
       values ('QnA','COMP104',1,'홍길동','질문, 답변','test', 1);
insert into board(category,code,id,name,title,content, C_exist) 
       values ('QnA','COMP104',1,'홍길동','질문, 댓글','test', 1);
insert into board(category,code,id,name,title,content, C_exist, R_exist) 
       values ('QnA','COMP104',1,'홍길동','질문, 답변, 댓글','test',1,1);

-- board_reply
insert into board_reply (idx, replierId, replierName, reply)
       values (3, 11, '정설영', 'reply test');
insert into board_reply (idx, replierId, replierName, reply)
       values (5, 11, '정설영', 'reply test1');

-- board_comments
insert into board_comments (idx, commenterId, commenterName, comments)
       values (4, 1, '홍길동', 'comment test');
insert into board_comments (idx, commenterId, commenterName, comments)
       values (5, 1, '홍길동', 'comment test1');
