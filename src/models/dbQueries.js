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

function enrollStudentInSubject(studentId, subjectId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO student_subject (student_id, subject_id) VALUES (?, ?)', [studentId, subjectId], (err, results) => {
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
            SELECT * FROM subjects
            JOIN student_subject ON subjects.subject_id = student_subject.subject_id
            WHERE student_subject.student_id = ? AND subjects.name LIKE ?`;

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
            WHERE ss.student_id IS NULL AND s.name LIKE ?`;

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
        connection.query('SELECT * FROM descriptions WHERE subject_id = ?',[subjectId], (err, results) => {
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

function selectSubjectInProfessor(subjectId, professorId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM professor_subject WHERE subject_id = ? AND professor_id = ?', [subjectId, professorId], (err, results) => {
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

module.exports = {
    findUsers,
    showUsers,
    getUserByID,
    addUser,
    deleteUser,
    editUser,
    updateUser,
    getAllSubjects,
    getAvailableCourses,
    getEnrolledCourses,
    enrollStudentInSubject,
    isEnrolled,
    getEnrolledCoursesBySearch,
    getAvailableCoursesBySearch,
    getDescription,
    insertFirstDescription,
    selectSubjectInProfessor,
    updateDescription
};