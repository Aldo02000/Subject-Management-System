const connection = require("./dbConnection");

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
        const sql = 'SELECT s.* FROM subjects s LEFT JOIN student_subject ss ON s.subject_id = ss.subject_id AND ss.student_id = ? WHERE ss.student_id IS NULL';
        connection.query(sql, [studentId], (err, results) => {
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

function createSubject(name, professorId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO subjects (name, professor_id) VALUES (?, ?)', [name, professorId], (err, results) => {
            if (err) {
                throw err;
            } else {
                resolve(results);
            }
        })
    })
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

function deleteSubject(subjectId) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM subjects WHERE subject_id = ?', [subjectId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                // Second query successful, proceed to the third query
                resolve(results);
            }
        });
    });
}

function enrollStudent(studentId, subjectId) {
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

function getEnrolledSubjectsBySearch(studentId, searchTerm) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM subjects JOIN student_subject ON subjects.subject_id = student_subject.subject_id WHERE student_subject.student_id = ? AND subjects.name LIKE ?';

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

function getAvailableSubjectsBySearch(studentId, searchTerm) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT s.* FROM subjects s LEFT JOIN student_subject ss ON s.subject_id = ss.subject_id AND ss.student_id = ? WHERE ss.student_id IS NULL AND s.name LIKE ?';

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

function getAnnouncements(subjectId) {
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

function selectSubjectInProfessor(subjectId, professorId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM subjects s WHERE s.subject_id = ? AND s.professor_id = ?', [subjectId, professorId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
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

function insertAnnouncement(subjectId, announcement) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO announcements (subject_id, announcement) VALUES (?, ?)', [subjectId, announcement], (err, results) => {
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

function savePdf(subjectId, filePath, filename, typeOfPdf) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO pdf_files (subject_id, filepath, filename, typeOfPdf) VALUES (?, ?, ?, ?)', [subjectId, filePath, filename, typeOfPdf], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


module.exports = {
    getAvailableCourses,
    getEnrolledCourses,
    getAllProfessorSubjects,
    createSubject,
    insertFirstDescription,
    deleteSubject,
    enrollStudent,
    getEnrolledSubjectsBySearch,
    getAvailableSubjectsBySearch,
    getDescription,
    getAnnouncements,
    selectSubjectInStudent,
    getPdfFilePath,
    selectSubjectInProfessor,
    getStudentsOfSubject,
    getNumberOfStudentsInSubject,
    updateDescription,
    insertAnnouncement,
    deleteAnnouncement,
    deletePdfFile,
    savePdf
}