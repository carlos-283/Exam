create database company;
use company;
create table employees(
id Int AUTO_INCREMENT primary key,
name varchar(30)  NOT NULL,
lastName varchar(30)  NOT NULL,
secLastName varchar(30)  NOT NULL,
birthDate date  NOT NULL,
address varchar(50)  NOT NULL,
phone char(10)  NOT NULL,
active boolean  NOT NULL
);

