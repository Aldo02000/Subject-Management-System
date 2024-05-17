const bcrypt = require("bcrypt");
const userService = require("../services/userService");
const subjectService = require("../services/subjectService");

async function renderProfessor(user, res) {

    const subjects = await subjectService.getProfessorSubjects(user.id);

    res.render('professor_new', {
        name: user.name,
        email: user.email,
        professorId: user.id,
        subjects,
        layout: 'page',
    });
}

async function renderStudent(user, res) {

    const enrolledCourses = await subjectService.getEnrolledCourses(user.id);

    res.render('student_new', {
        name: user.name,
        email: user.email,
        studentId: user.id,
        enrolledCourses,
        layout: 'page'
    });
}

async function renderAdmin(user, res) {

    const users = await userService.getAllUsers();

    res.render('adminDashboard', {users, layout: 'admin'});
}

function renderUserPage(req, res) {

    user = req.user;
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
        const users = await userService.searchUsers(searchTerm);
        res.render('adminDashboard', {users, layout: 'admin'});
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function renderAddUser(req, res, next) {
    res.render('addUser', {layout: 'admin'});
}

async function addUser(req, res, next) {

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

        const existingUser = await userService.findUser(uniqueID);

        if (existingUser != null) {
            return res.render('addUser', {
                error: 'ID already exists', layout: 'admin', id: uniqueID,
                formData: {
                    name: fullName,
                    email: email,
                }
            });
        }

        const existingEmailUser = await userService.findUserByEmail(email);

        if (existingEmailUser != null) {
            return res.render('addUser', {
                error: 'Email already exists', layout: 'admin', id: uniqueID,
                formData: {
                    name: fullName,
                    email: email,
                }
            });
        }

        await userService.addUser(uniqueID, fullName, email, password, role);
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

async function renderEditUser(req, res, next) {
    try {
        const user = await userService.findUser(req.params.ID);
        res.render('editUser', {layout: 'admin', user})
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function editUser(req, res, next) {
    const {fullName, email, password, role} = req.body;
    const saltRounds = 10;

    const results = await userService.findUser(req.params.ID);

    if (!fullName || !email || !role) {
        return res.render('editUser', {
            error: 'All fields are required', results, layout: 'admin',
            formData: {
                id: req.params.ID,
                name: req.params.fullName,
                email: req.params.email,
            }
        });
    }

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            if (err) throw err;

            let sql = 'UPDATE User SET  NameOfUser = ?, Email = ?, RoleOfUser = ?';
            const values = [fullName, email, role];

            if (password) {
                sql += ', AccountPassword = ?';
                values.push(hash);
            }

            sql += ' WHERE Id = ?';
            values.push(req.params.ID);

            try {
                await userService.updateUser(sql, values);
                res.render('editUser', {success: 'User updated successfully', layout: 'admin'})
            } catch (error) {
                console.error(error);
                return res.render('editUser', {error: 'Something went wrong', layout: 'admin'});
            }
        });
    });
}

async function deleteUser(req, res, next) {
    try {
        await userService.deleteUser(req.params.ID);
        res.redirect('/user')
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    renderUserPage,
    searchUser,
    renderAddUser,
    addUser,
    renderEditUser,
    editUser,
    deleteUser,
}