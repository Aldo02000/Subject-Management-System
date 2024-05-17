const subjectService = require("../services/subjectService");

async function getAvailableSubjects(req, res, next) {

    const availableSubjects = await subjectService.getAvailableSubjects(req.user.id);
    const enrolledSubjects = await subjectService.getEnrolledCourses(req.user.id);

    res.render('availableSubjects', {
        availableSubjects,
        name: req.user.name,
        email: req.user.email,
        enrolledSubjects,
        studentId: req.user.id,
    });
}

async function enrollStudent(req, res) {
    try {
        // Check if the user is authenticated
        const subjectId = req.params.subjectId;
        const studentId = req.user.id;

        await subjectService.enrollStudent(studentId, subjectId);
        res.redirect('/user');

    } catch (error) {
        console.error('Error enrolling in subject:', error);
        res.status(500).send('Error enrolling in subject');
    }
}

async function searchSubject(req, res) {
    const searchTerm = req.body.term;
    const studentId = req.user.id;

    try {
        const enrolledCourses = await subjectService.getEnrolledSubjectsBySearch(studentId, searchTerm);
        const availableCourses = await subjectService.getAvailableSubjectsBySearch(studentId, searchTerm);
        const allEnrolledCourses = await subjectService.getEnrolledCourses(studentId);
        res.render('subjectSearch_new', {
            allEnrolledCourses,
            enrolledCourses,
            name: req.user.name,
            email: req.user.email,
            availableCourses,
            studentId
        });
    } catch (err) {
        console.error('Error searching for subjects:', err);
        res.status(500).json({error: 'An error occurred while searching for subjects'});
    }

}

module.exports = {
    getAvailableSubjects,
    enrollStudent,
    searchSubject
}