const connection = require("./dbConnection");

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

function getAllUsers() {
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


module.exports = {
    findUser,
    getAllUsers,
    searchUsers
}