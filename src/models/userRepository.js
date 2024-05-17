const connection = require("./dbConnection");
const bcrypt = require("bcrypt");

function findUser(ID) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM User WHERE ID = ?', [ID], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM User WHERE Email = ?', [email], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM User WHERE NOT RoleOfUser = ?', ['Admin'], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function searchUsers(searchTerm) {
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

module.exports = {
    findUser,
    getAllUsers,
    searchUsers,
    deleteUser,
    findUserByEmail,
    addUser,
    updateUser
}