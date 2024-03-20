FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
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


INSERT INTO User (Id, NameOfUser, Email, AccountPassword, RoleOfUser) VALUES ('S00001', "Aldo Bega", "aldo.bega@example.com", "$2b$10$fyNRp.p.q9jdlpsxcFx74.dNdG4r3NDm6aRqEnoYh70OCz8xDZ08G", "Superadmin");

SELECT * FROM User;