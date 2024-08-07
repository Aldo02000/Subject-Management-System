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

CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    professor_id CHAR(6),
    student_count INT DEFAULT 0,
    FOREIGN KEY (professor_id) REFERENCES User(Id) ON DELETE CASCADE
);

CREATE TABLE student_subject (
    student_id CHAR(6),
    subject_id INT,
    FOREIGN KEY (student_id) REFERENCES User(Id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

CREATE TABLE descriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    description TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    announcement TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

CREATE TABLE pdf_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    filename VARCHAR(255),
    filepath VARCHAR(255),
    typeOfPdf VARCHAR(10) NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);