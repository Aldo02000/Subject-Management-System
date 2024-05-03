const passport = require('passport');
const bcrypt = require('bcrypt');
const query = require('../models/dbQueries')
const db = require('../models/dbConnection');
const {customAlphabet} = require('nanoid');
const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the destination directory for uploaded files
        cb(null, 'C:/Users/Bega/Desktop/STUMA/Subject-Management-System/pdfs');
    },
    filename: function (req, file, cb) {
        // Use the original filename
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

exports.uploadLectures = (req, res) => {
    upload.single('pdfFile')(req, res, err => {
        if (err instanceof multer.MulterError) {
            // Handle Multer errors
            return res.status(400).send('File upload error: ' + err.message);
        } else if (err) {
            // Handle other errors
            console.error('Error uploading file:', err);
            return res.status(500).send('Internal server error 1');
        }

        // Access the uploaded file via req.file
        const filePath = req.file.path;
        const filename = req.file.originalname;
        const {Id, subjectId} = req.params;

        // Save filePath to your database using the model
        query.savePdf(Id, subjectId, filePath, filename, "lecture")
            .then(() => {
                res.redirect(`/welcome/${Id}/subject/${subjectId}`)
            })
            .catch(err => {
                console.error('Error uploading file:', err);
                res.status(500).send('Internal server error 2');
            });
    });
};

exports.uploadLabs = (req, res) => {
    upload.single('pdfFile')(req, res, err => {
        if (err instanceof multer.MulterError) {
            // Handle Multer errors
            return res.status(400).send('File upload error: ' + err.message);
        } else if (err) {
            // Handle other errors
            console.error('Error uploading file:', err);
            return res.status(500).send('Internal server error 1');
        }

        // Access the uploaded file via req.file
        const filePath = req.file.path;
        const filename = req.file.originalname;
        const {Id, subjectId} = req.params;

        // Save filePath to your database using the model
        query.savePdf(Id, subjectId, filePath, filename, "lab")
            .then(() => {
                res.redirect(`/welcome/${Id}/subject/${subjectId}`)
            })
            .catch(err => {
                console.error('Error uploading file:', err);
                res.status(500).send('Internal server error 2');
            });
    });
};

function isAdmin(req, res, next) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        // Check if the user's role is admin
        if (req.user.RoleOfUser === 'Admin') {
            // If the user is authenticated and their role is admin, call the next middleware function
            return next();
        }
    }

    // If the user is not authenticated or their role is not admin, redirect them to the login page
    res.redirect('/login');
}

exports.index = (req, res) => {
    res.render('index', {layout: 'main'});
}

exports.login = (req, res) => {
    res.render('login', {message: req.flash('error'), layout: 'main'});
}

exports.loginPost = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/login');
        }

        // Authenticate the user and store user information in the session
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }

            // Authentication successful, generate the redirect URL with the user ID
            const redirectURL = `/welcome/${user.Id}`;

            // Redirect to the generated URL
            return res.redirect(redirectURL);
        });
    })(req, res, next);
};

exports.welcome = async (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }

    if (req.user.RoleOfUser === 'Admin') {
        return res.redirect('/admin');
    }

    if (req.user.RoleOfUser === 'Student') {
        const studentId = req.user.Id;
        // const subjects = await query.getAllSubjects();
        // Fetch available courses
        const availableCourses = await query.getAvailableCourses(studentId);
        // Fetch enrolled courses for the student
        const enrolledCourses = await query.getEnrolledCourses(studentId);
        // Render the student view with the user's name and enrolled/available courses
        res.render('student_new', {
            name: req.user.NameOfUser,
            email: req.user.Email,
            studentId,
            enrolledCourses,
            availableCourses,
            layout: 'page'
        });

    }

    if (req.user.RoleOfUser === 'Professor') {
        const professorId = req.user.Id;

        const subjects = await query.getAllProfessorSubjects(professorId);

        res.render('professor_new', {
            name: req.user.NameOfUser,
            email: req.user.Email,
            professorId,
            subjects,
            layout: 'page',
        });
    }
};

exports.addSection = (req, res) => {
    res.json({success: true});
}


exports.find = async (req, res, next) => {
    try {
        let searchTerm = req.body.search;
        const results = await query.findUsers(searchTerm);
        res.render('home', {results, layout: 'admin'});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.admin = async (req, res, next) => {
    if (!req.user || !isAdmin) {
        res.status(401).send('Unauthorized');
        return;
    }

    try {
        const results = await query.showUsers();
        res.render('home', {results, layout: 'admin'});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.logout = (req, res) => {
    req.logout(() => res.redirect('/login'));
}

exports.adduser = (req, res) => {
    res.render('addUser', {layout: 'admin'});
}

exports.adduserPost = async (req, res) => {
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

        // if (ID.length !== 6) {
        //     return res.render('addUser', {
        //         error: 'ID must be exactly 6 characters', layout: 'admin',
        //         formData: {
        //             id: ID,
        //             name: fullName,
        //             email: email,
        //         }
        //     });
        // }


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
};

exports.edituser = async (req, res) => {

    try {
        const results = await query.editUser(req.params.ID);
        res.render('editUser', {layout: 'admin', results})
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.edituserPost = async (req, res) => {
    const {fullName, email, password, role} = req.body;
    const saltRounds = 10;

    const results = await query.editUser(req.params.ID);

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

    // if (ID.length !== 6) {
    //     return res.render('editUser', {
    //         error: 'ID must be exactly 6 characters', layout: 'admin',
    //         formData: {
    //             id: ID,
    //             name: fullName,
    //             email: email,
    //         }
    //     });
    // }

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
                await query.updateUser(sql, values);
                res.render('editUser', {success: 'User updated successfully', layout: 'admin'})
            } catch (error) {
                console.error(error);
                return res.render('editUser', {error: 'Something went wrong', layout: 'admin'});
            }
        });
    });
}

exports.delete = async (req, res) => {

    try {
        await query.deleteUser(req.params.ID);
        res.redirect('/admin')
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.createSubject = async (req, res) => {
    const {name} = req.body;
    const professorId = req.params.Id;
    const description = req.body.description;

    // Insert new subject into the database
    const createdSubject = await query.createSubject(name, professorId);
    await query.insertFirstDescription(createdSubject.insertId, description);


    res.redirect(`/welcome/${professorId}`);
}

exports.deleteSubject = (req, res) => {
    const {Id, subjectId} = req.params;


    // Delete the subject from the database
    db.query('DELETE FROM student_subject WHERE subject_id = ?', [subjectId], (err, result) => {
        if (err) throw err;
    });

    db.query('DELETE FROM professor_subject WHERE subject_id = ?', [subjectId], (err, result) => {
        if (err) throw err;
    });

    db.query('DELETE FROM subjects WHERE subject_id = ?', [subjectId], (err, result) => {
        if (err) throw err;
        // Redirect back to the welcome page after deletion
        res.redirect(`/welcome/${Id}`);
    });

}


// Function to render student view with available subjects
// exports.viewAllSubjects = async (req, res) => {
//     try {
//         const subjects = await query.getAvailableCourses(studentId);
//         console.log(subjects);
//         res.render('student', {subjects, layout: 'page'});
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// };

// exports.enrollSubject = async (req, res) => {
//     const studentId = req.user.Id;
//     const subjectId = req.params.subjectId;
//     try {
//         await query.enrollStudentInSubject(studentId, subjectId);
//         res.redirect('/welcome/' + studentId);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// };

// exports.viewEnrolledCourses = async (req, res) => {
//     const studentId = req.user.Id; // Assuming studentId is available in req.user
//
//     try {
//         const enrolledCourses = await query.getEnrolledCourses(studentId);
//         res.redirect('enrolled_courses', {enrolledCourses});
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };

exports.enrollStudent = async (req, res) => {
    try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        // Check if user ID exists in req.user
        if (!req.user.Id) {
            return res.status(400).send('User ID is missing');
        }

        const subjectId = req.params.subjectId;
        const studentId = req.user.Id;

        // Proceed with enrollment logic
        const isEnrolled = await query.isEnrolled(studentId, subjectId);
        if (isEnrolled) {
            return res.status(400).send('Student is already enrolled in this subject');
        } else {
            await query.enrollStudentInSubject(studentId, subjectId);
            res.redirect('/welcome/' + studentId);
        }
    } catch (error) {
        console.error('Error enrolling in subject:', error);
        res.status(500).send('Error enrolling in subject');
    }
}

exports.searchSubject = async (req, res) => {
    const searchTerm = req.query.term;
    const studentId = req.params.Id;

    try {
        const enrolledCourses = await query.getEnrolledCoursesBySearch(studentId, searchTerm);
        const availableCourses = await query.getAvailableCoursesBySearch(studentId, searchTerm);
        const allEnrolledCourses = await query.getEnrolledCourses(studentId);
        res.render('subjectSearch_new', {
            allEnrolledCourses,
            enrolledCourses,
            name: req.user.NameOfUser,
            email: req.user.Email,
            availableCourses,
            studentId
        });
    } catch (err) {
        console.error('Error searching for subjects:', err);
        res.status(500).json({error: 'An error occurred while searching for subjects'});
    }
};

exports.getAvailableSubjects = async (req, res) => {
    const studentId = req.params.Id;

    try {
        const availableCourses = await query.getAvailableCourses(studentId);
        const enrolledCourses = await query.getEnrolledCourses(studentId);
        res.render('availableSubjects', {
            availableCourses,
            name: req.user.NameOfUser,
            email: req.user.Email,
            enrolledCourses,
            studentId
        });
    } catch (err) {
        console.error('Error searching for subjects:', err);
        res.status(500).json({error: 'An error occurred while searching for subjects'});
    }
};


exports.viewSubjectDetails = async (req, res) => {
    const {Id, subjectId} = req.params;

    const lecturePath = await query.getPdfFilePath(subjectId, "lecture");
    const labPath = await query.getPdfFilePath(subjectId, "lab");

    if (req.user.RoleOfUser === 'Student') {

        const [descriptionRows] = await query.getDescription(subjectId);
        let announcementRows = await query.getAnnouncement(subjectId);

        const subject_result = await query.selectSubjectInStudent(subjectId, Id);
        const enrolledCourses = await query.getEnrolledCourses(Id);

        res.render('subject_new_student', {
            enrolledCourses,
            subject_name: subject_result[0].subject_name,
            studentId: Id,
            name: req.user.NameOfUser,
            email: req.user.Email,
            descriptionText: descriptionRows.description,
            announcementRows,
            lectureFilePath: lecturePath,
            labFilePath: labPath
        });
    }

    if (req.user.RoleOfUser === 'Professor') {
        try {
            const [descriptionRows] = await query.getDescription(subjectId);

            const descriptionLine = descriptionRows.description;

            let announcementRows = await query.getAnnouncement(subjectId);

            const subject_result = await query.selectSubjectInProfessor(subjectId, Id);

            const subjects = await query.getAllProfessorSubjects(Id);

            const students = await query.getStudentsOfSubject(subjectId);

            const [numberOfStudents] = await query.getNumberOfStudentsInSubject(subjectId);

            res.render('subject_new_professor', {
                subject_name: subject_result[0].subject_name,
                Id: Id,
                name: req.user.NameOfUser,
                email: req.user.Email,
                subjectId,
                descriptionText: descriptionLine,
                announcementRows,
                subjects,
                lectureFilePath: lecturePath,
                labFilePath: labPath,
                students,
                numberOfStudents: numberOfStudents.student_count
            });

        } catch (error) {
            console.error('Error retrieving data:', error);
            throw new Error('Failed to retrieve data from the database');
        }
    }
};

exports.deletePdf = async (req, res) => {
    const {pdfId} = req.params;

    await query.deletePdfFile(pdfId);

    res.redirect(`/welcome/${req.params.Id}/subject/${req.params.subjectId}`)
}

exports.editSubjectDescription = async (req, res) => {
    // Check if description already exists for the subject
    const {subjectId} = req.params;

    await query.updateDescription(req.body.description, subjectId);

    // Redirect back to the subject details page
    res.redirect(`/welcome/${req.params.Id}/subject/${req.params.subjectId}`);

};

exports.addAnnouncement = async (req, res) => {
    const {subjectId, Id} = req.params;

    await query.insertAnnouncement(subjectId, Id, req.body.announcement);

    // Redirect back to the subject details page
    res.redirect(`/welcome/${req.params.Id}/subject/${req.params.subjectId}`);
};

exports.deleteAnnouncement = async (req, res) => {
    const {announcementId} = req.params;

    await query.deleteAnnouncement(announcementId);

    // Redirect back to the subject details page
    res.redirect(`/welcome/${req.params.Id}/subject/${req.params.subjectId}`);
};