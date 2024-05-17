const subjectService = require("../services/subjectService");

async function createSubject(req, res, next) {
    const {name} = req.body;
    const professorId = req.user.id;
    const description = req.body.description;

    // Insert new subject into the database
    const createdSubject = await subjectService.createSubject(name, professorId);
    await subjectService.insertFirstDescription(createdSubject.insertId, description);

    res.redirect('/user');
}

async function deleteSubject(req, res, next) {

    await subjectService.deleteSubject(req.params.subjectId);
    res.redirect('/user');
}

module.exports = {
    createSubject,
    deleteSubject
}