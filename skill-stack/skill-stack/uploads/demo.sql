CREATE DATABASE COLLEGE;
USE COLLEGE;
CREATE table Student
(RNO INT PRIMARY KEY,
NAME VARCHAR(50),
MARKS float ,
CITY VARCHAR(30));
USE Student;
insert into Student
values(1,"Neha",98.77,"Nandurbar"),
		(2,"Piuu",90.00,"Surat"),
        (3,"Gaurav",79.08,"Jalgaon"),
        (4,"Pratiksha",99.95,"Nandrbar"),
        (5,"Bhakti",12.44,"Surat"),
        (6,"Shrivalli",56,"Nandurbar");
select*from Student;
select city,name from Student;
select *from Student 
where marks>90;
select*FROM Student
LIMIT 3;
select*FROM Student
where city in ("Nandurbar");


