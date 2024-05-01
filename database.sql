DROP DATABASE SubjectSystem;
CREATE DATABASE SubjectSystem;
USE SubjectSystem;

CREATE TABLE User
(
	Id CHAR(6) NOT NULL,
    NameOfUser VARCHAR(30) NOT NULL,
    Email VARCHAR(30) NOT NULL,
    AccountPassword VARCHAR(100) NOT NULL,
    RoleOfUser VARCHAR(10) NOT NULL,
    CONSTRAINT PK
	 PRIMARY KEY (Id)
);

DROP TABLE  subjects;

CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    professor_id CHAR(6),
    student_id CHAR(6),
    FOREIGN KEY (professor_id) REFERENCES User(Id)
);

DROP TABLE  student_subject;

CREATE TABLE student_subject (
    student_id CHAR(6),
    subject_id INT,
    FOREIGN KEY (student_id) REFERENCES User(Id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

DROP TABLE  professor_subject;

CREATE TABLE professor_subject (
    professor_id CHAR(6),
    subject_id INT,
    FOREIGN KEY (professor_id) REFERENCES User(Id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

DROP TABLE  descriptions;

CREATE TABLE descriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    description TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

DROP TABLE  announcements;

CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id CHAR(6),
    subject_id INT NOT NULL,
    announcement TEXT,
    FOREIGN KEY (professor_id) REFERENCES User(Id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);