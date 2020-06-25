SELECT @rownum := @rownum+1 AS ROWNUM, B.*
FROM board_comments AS B, (SELECT @rownum:=0) N 
where idx = 4
order by ROWNUM desc;
