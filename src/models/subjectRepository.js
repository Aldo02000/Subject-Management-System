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

module.exports = {
    getAvailableCourses,
    getEnrolledCourses,
    getAllProfessorSubjects
}