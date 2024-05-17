const subjectService = require("../services/subjectService");

async function viewSubjectDetails(req, res) {
    const {subjectId} = req.params;
    const Id = req.user.id;

    const lecturePath = await subjectService.getPdfFilePath(subjectId, "lecture");
    const labPath = await subjectService.getPdfFilePath(subjectId, "lab");

    if (req.user.role === 'Student') {

        const [descriptionRows] = await subjectService.getDescription(subjectId);
        let announcementRows = await subjectService.getAnnouncements(subjectId);

        const subject_result = await subjectService.selectSubjectInStudent(subjectId, Id);
        const enrolledCourses = await subjectService.getEnrolledCourses(Id);

        res.render('subject_new_student', {
            enrolledCourses,
            subject_name: subject_result[0].subject_name,
            studentId: Id,
            name: req.user.name,
            email: req.user.email,
            descriptionText: descriptionRows.description,
            announcementRows,
            lectureFilePath: lecturePath,
            labFilePath: labPath
        });
    }

    if (req.user.role === 'Professor') {
        try {
            const [descriptionRows] = await subjectService.getDescription(subjectId);

            const descriptionLine = descriptionRows.description;

            let announcementRows = await subjectService.getAnnouncements(subjectId);

            const subject_result = await subjectService.selectSubjectInProfessor(subjectId, Id);

            const subjects = await subjectService.getProfessorSubjects(Id);

            const students = await subjectService.getStudentsOfSubject(subjectId);

            const [numberOfStudents] = await subjectService.getNumberOfStudentsInSubject(subjectId);

            res.render('subject_new_professor', {
                subject_name: subject_result[0].name,
                Id: Id,
                name: req.user.name,
                email: req.user.email,
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
}

async function editSubjectDescription(req, res, next) {

    const {subjectId} = req.params;

    await subjectService.updateDescription(req.body.description, subjectId);

    // Redirect back to the subject details page
    res.redirect(`/subject/${req.params.subjectId}`);
}

async function addAnnouncement(req, res, next) {

    const {subjectId} = req.params;

    await subjectService.insertAnnouncement(subjectId, req.body.announcement);

    // Redirect back to the subject details page
    res.redirect(`/subject/${req.params.subjectId}`);
}

async function deleteAnnouncement(req, res, next) {

    const {announcementId} = req.params;

    await subjectService.deleteAnnouncement(announcementId);

    // Redirect back to the subject details page
    res.redirect(`/subject/${req.params.subjectId}`);
}

async function getAvailableSubjects(req, res, next) {

    const studentId = req.user.id;

    try {
        const availableCourses = await subjectService.getAvailableSubjects(studentId);
        const enrolledCourses = await subjectService.getEnrolledCourses(studentId);
        res.render('availableSubjects', {
            availableCourses,
            name: req.user.name,
            email: req.user.email,
            enrolledCourses,
            studentId
        });
    } catch (err) {
        console.error('Error searching for subjects:', err);
        res.status(500).json({error: 'An error occurred while searching for subjects'});
    }
}

const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the destination directory for uploaded files
        cb(null, './pdfs');
    },
    filename: function (req, file, cb) {
        // Use the original filename
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

async function uploadLectures(req, res, next) {

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
        const {subjectId} = req.params;

        // Save filePath to your database using the model
        subjectService.savePdf(subjectId, filePath, filename, "lecture")
            .then(() => {
                res.redirect(`/subject/${subjectId}`)
            })
            .catch(err => {
                console.error('Error uploading file:', err);
                res.status(500).send('Internal server error 2');
            });
    });
}

async function uploadLabs(req, res, next) {

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
        const {subjectId} = req.params;

        // Save filePath to your database using the model
        subjectService.savePdf(subjectId, filePath, filename, "lab")
            .then(() => {
                res.redirect(`/subject/${subjectId}`)
            })
            .catch(err => {
                console.error('Error uploading file:', err);
                res.status(500).send('Internal server error 2');
            });
    });
}

async function deletePdf(req, res, next) {
    const {pdfId} = req.params;

    await subjectService.deletePdfFile(pdfId);

    res.redirect(`/subject/${req.params.subjectId}`)
}

module.exports = {
    viewSubjectDetails,
    editSubjectDescription,
    addAnnouncement,
    deleteAnnouncement,
    getAvailableSubjects,
    uploadLectures,
    uploadLabs,
    deletePdf
}