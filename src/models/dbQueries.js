const connection = require('./dbConnection');
const bcrypt = require('bcrypt');

function findUsers(searchTerm) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM User WHERE NameOfUser LIKE ? OR Id LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function showUsers() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM User', (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getUserByID(ID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User WHERE Id = ?';
        connection.query(sql, [ID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function addUser(ID, fullName, email, password, role) {
    return new Promise((resolve, reject) => {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                reject(err);
                return;
            }
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    reject(err);
                    return;
                }
                const sql = 'INSERT INTO User (Id, NameOfUser, Email, AccountPassword, RoleOfUser) VALUES (?, ?, ?, ?, ?)';
                connection.query(sql, [ID, fullName, email, hash, role], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        });
    });
}

function deleteUser(ID) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM User WHERE ID = ?', [ID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function editUser(ID) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM User WHERE ID = ?', [ID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


function updateUser(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getAllSubjects() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM subjects', (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getEnrolledCourses(studentId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM subjects JOIN student_subject ON subjects.subject_id = student_subject.subject_id WHERE student_subject.student_id = ?', [studentId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getAvailableCourses(studentId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT s.*
            FROM subjects s
                     LEFT JOIN student_subject ss ON s.subject_id = ss.subject_id AND ss.student_id = ?
            WHERE ss.student_id IS NULL`;

        connection.query(sql, [studentId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function isEnrolled(studentId, subjectId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM subjects WHERE student_id = ? AND subject_id = ?';
        connection.query(sql, [studentId, subjectId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                // If the query returns any results, the student is enrolled; otherwise, they're not enrolled
                resolve(results.length > 0);
            }
        });
    });
}

function getEnrolledCoursesBySearch(studentId, searchTerm) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT *
            FROM subjects
                     JOIN student_subject ON subjects.subject_id = student_subject.subject_id
            WHERE student_subject.student_id = ?
              AND subjects.name LIKE ?`;

        const searchTermWithWildcards = `%${searchTerm}%`;

        connection.query(sql, [studentId, searchTermWithWildcards], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getAvailableCoursesBySearch(studentId, searchTerm) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT s.*
            FROM subjects s
                     LEFT JOIN student_subject ss ON s.subject_id = ss.subject_id AND ss.student_id = ?
            WHERE ss.student_id IS NULL
              AND s.name LIKE ?`;

        const searchTermWithWildcards = `%${searchTerm}%`;

        connection.query(sql, [studentId, searchTermWithWildcards], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getDescription(subjectId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM descriptions WHERE subject_id = ?', [subjectId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function insertFirstDescription(subjectId, descriptionText) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO descriptions (subject_id, description) VALUES (?, ?)', [subjectId, descriptionText], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function createSubject(name, professorId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO subjects (name, professor_id) VALUES (?, ?)', [name, professorId], (err, results) => {
            if (err) {
                throw err;
            } else {
                const subjectId = results.insertId; // Get the ID of the newly inserted subject

                // Insert the subject into the professor_subject table
                connection.query('INSERT INTO professor_subject (subject_id, professor_id) VALUES (?, ?)', [subjectId, professorId], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            }
        })
    })
}

function selectSubjectInProfessor(subjectId, professorId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT ps.*, s.name AS subject_name FROM professor_subject ps JOIN subjects s ON ps.subject_id = s.subject_id WHERE ps.subject_id = ? AND ps.professor_id = ?', [subjectId, professorId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function selectSubjectInStudent(subjectId, studentId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT ss.*, s.name AS subject_name FROM student_subject ss JOIN subjects s ON ss.subject_id = s.subject_id WHERE ss.subject_id = ? AND ss.student_id = ?', [subjectId, studentId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getAllProfessorSubjects(professorId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM subjects WHERE professor_id = ?', [professorId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function updateDescription(description, subjectId) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE descriptions SET description = ? WHERE subject_id = ?', [description, subjectId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function insertAnnouncement(subjectId, professorId, announcement) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO announcements (subject_id, professor_id, announcement) VALUES (?, ?, ?)', [subjectId, professorId, announcement], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getAnnouncement(subjectId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM announcements WHERE subject_id = ?', [subjectId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function deleteAnnouncement(announcementId) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM announcements WHERE announcement_id = ?', [announcementId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function savePdf(professorId, subjectId, filePath, filename, typeOfPdf) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO pdf_files (professor_id, subject_id, filepath, filename, typeOfPdf) VALUES (?, ?, ?, ?, ?)', [professorId, subjectId, filePath, filename, typeOfPdf], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

function getPdfFilePath(subjectId, typeOfPdf) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM pdf_files WHERE subject_id = ? AND typeOfPdf = ?', [subjectId, typeOfPdf] ,(err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function deletePdfFile(pdfId) {
    return new Promise((resolve, reject) => {

        connection.query('DELETE FROM pdf_files WHERE id = ?', [pdfId] ,(err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function enrollStudentInSubject(studentId, subjectId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO student_subject (student_id, subject_id) VALUES (?, ?)', [studentId, subjectId], (err, results) => {
            if (err) {
                throw err;
            } else {
                connection.query('UPDATE subjects SET student_count = student_count + 1 WHERE subject_id = ?', [subjectId], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            }
        })
    })
}

function getStudentsOfSubject(subjectId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT U.Id, U.NameOfUser, U.Email FROM User U JOIN student_subject SS ON U.Id = SS.student_id WHERE SS.subject_id = ?', [subjectId] ,(err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getNumberOfStudentsInSubject(subjectId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT student_count FROM subjects WHERE subject_id = ?', [subjectId] ,(err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


module.exports = {
    findUsers,
    showUsers,
    getUserByID,
    addUser,
    deleteUser,
    editUser,
    updateUser,
    createSubject,
    getAllSubjects,
    getAvailableCourses,
    getAllProfessorSubjects,
    getEnrolledCourses,
    enrollStudentInSubject,
    isEnrolled,
    getEnrolledCoursesBySearch,
    getAvailableCoursesBySearch,
    getDescription,
    insertFirstDescription,
    selectSubjectInProfessor,
    updateDescription,
    selectSubjectInStudent,
    insertAnnouncement,
    getAnnouncement,
    deleteAnnouncement,
    getPdfFilePath,
    savePdf,
    deletePdfFile,
    getStudentsOfSubject,
    getNumberOfStudentsInSubject
};