-- student 1 / 1
-- professor 11 / 11
-- 게시판은 Software Engineering 사용


-- student
insert into student values(1, 1, '홍길동', 'computer science');

-- professor
insert into professor values(11, 11, '정설영', 'computer science');

-- subject
insert into subject(id,name,x,y,pid) values('COMP104', 'Software Engineering', 11, 22, 11);
insert into subject(id,name,x,y,pid) values('COMP114', 'Algorithm', 33, 44, 11);

-- sugang
insert into sugang values('COMP104', 1);
insert into sugang values('COMP114', 1);

-- baord
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
