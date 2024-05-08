const query = require("../models/dbQueries");
const userRepository = require("../models/userRepository");
const subjectRepository = require("../models/subjectRepository");
const {customAlphabet} = require("nanoid");
const bcrypt = require("bcrypt");

async function renderProfessor(user, res) {

    const subjects = await subjectRepository.getAllProfessorSubjects(user.id);

    res.render('professor_new', {
        name: user.name,
        email: user.email,
        professorId: user.id,
        subjects,
        layout: 'page',
    });
}

async function renderStudent(user, res) {

    const enrolledCourses = await subjectRepository.getEnrolledCourses(user.id);
    const availableCourses = await subjectRepository.getAvailableCourses(user.id);

    res.render('student_new', {
        name: user.name,
        email: user.email,
        studentId: user.id,
        enrolledCourses,
        availableCourses,
        layout: 'page'
    });
}

async function renderAdmin(user, res) {

    const users = await userRepository.getAllUsers();

    res.render('adminDashboard', {users, layout: 'admin'});
}

function renderUserPage(user, res) {
    if (user.role === "Admin") {
        renderAdmin(user, res);
    }
    else if (user.role === "Professor") {
        renderProfessor(user, res)
    }
    else if (user.role === "Student") {
        renderStudent(user, res);
    }
    else {
        console.log("No such role")
    }
}

async function searchUser(req, res, next) {
    try {
        const searchTerm = req.body.search;
        const users = await userRepository.searchUsers(searchTerm);
        res.render('adminDashboard', {users, layout: 'admin'});
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function adduser(req, res, next) {

    const {customAlphabet} = require('nanoid');
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

    const {fullName, email, password, role} = req.body;

    const generateID = customAlphabet(alphabet, 6);
    const uniqueID = generateID();

    try {
        if (!fullName || !email || !password || !role) {
            return res.render('addUser', {
                error: 'All fields are required', layout: 'admin', id: generatedID,
                formData: {
                    name: fullName,
                    email: email,
                }
            });
        }

        const existingUser = await query.getUserByID(uniqueID);

        if (existingUser.length > 0) {
            return res.render('addUser', {
                error: 'ID already exists', layout: 'admin', id: uniqueID,
                formData: {
                    name: fullName,
                    email: email,
                }
            });
        }

        const existingEmailUser = await query.getUserByEmail(email);

        if (existingEmailUser.length > 0) {
            return res.render('addUser', {
                error: 'Email already exists', layout: 'admin', id: uniqueID,
                formData: {
                    name: fullName,
                    email: email,
                }
            });
        }

        await query.addUser(uniqueID, fullName, email, password, role);
        res.render('addUser', {success: 'User added successfully', layout: 'admin'});
    } catch (error) {
        console.error(error);
        res.render('addUser', {
            error: 'Something went wrong', layout: 'admin', id: uniqueID,
            formData: {
                name: fullName,
                email: email,
            }
        });
    }
}

// exports.adduserPost = async (req, res) => {
//     const {fullName, email, password, role} = req.body;
//
//     const generateID = customAlphabet(alphabet, 6);
//     const uniqueID = generateID();
//
//     try {
//         if (!fullName || !email || !password || !role) {
//             return res.render('addUser', {
//                 error: 'All fields are required', layout: 'admin', id: generatedID,
//                 formData: {
//                     name: fullName,
//                     email: email,
//                 }
//             });
//         }
//
//         const existingUser = await query.getUserByID(uniqueID);
//
//         if (existingUser.length > 0) {
//             return res.render('addUser', {
//                 error: 'ID already exists', layout: 'admin', id: uniqueID,
//                 formData: {
//                     name: fullName,
//                     email: email,
//                 }
//             });
//         }
//
//         const existingEmailUser = await query.getUserByEmail(email);
//
//         if (existingEmailUser.length > 0) {
//             return res.render('addUser', {
//                 error: 'Email already exists', layout: 'admin', id: uniqueID,
//                 formData: {
//                     name: fullName,
//                     email: email,
//                 }
//             });
//         }
//
//         await query.addUser(uniqueID, fullName, email, password, role);
//         res.render('addUser', {success: 'User added successfully', layout: 'admin'});
//     } catch (error) {
//         console.error(error);
//         res.render('addUser', {
//             error: 'Something went wrong', layout: 'admin', id: uniqueID,
//             formData: {
//                 name: fullName,
//                 email: email,
//             }
//         });
//     }
// };
//
// exports.edituserPost = async (req, res) => {
//     const {fullName, email, password, role} = req.body;
//     const saltRounds = 10;
//
//     const results = await query.findUser(req.params.ID);
//
//     if (!fullName || !email || !role) {
//         return res.render('editUser', {
//             error: 'All fields are required', results, layout: 'admin',
//             formData: {
//                 id: req.params.ID,
//                 name: req.params.fullName,
//                 email: req.params.email,
//             }
//         });
//     }
//
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//         bcrypt.hash(password, salt, async function (err, hash) {
//             if (err) throw err;
//
//             let sql = 'UPDATE User SET  NameOfUser = ?, Email = ?, RoleOfUser = ?';
//             const values = [fullName, email, role];
//
//             if (password) {
//                 sql += ', AccountPassword = ?';
//                 values.push(hash);
//             }
//
//             sql += ' WHERE Id = ?';
//             values.push(req.params.ID);
//
//             try {
//                 await query.updateUser(sql, values);
//                 res.render('editUser', {success: 'User updated successfully', layout: 'admin'})
//             } catch (error) {
//                 console.error(error);
//                 return res.render('editUser', {error: 'Something went wrong', layout: 'admin'});
//             }
//         });
//     });
// };
//
// exports.delete = async (req, res) => {
//
//     try {
//         await query.deleteUser(req.params.ID);
//         res.redirect('/admin')
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };

module.exports = {
    renderUserPage,
    searchUser,
    adduser
}