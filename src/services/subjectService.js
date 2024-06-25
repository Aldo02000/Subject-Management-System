const subjectRepository = require("../models/subjectRepository");

async function getProfessorSubjects(professorId) {
    return await subjectRepository.getAllProfessorSubjects(professorId);
}

async function getEnrolledCourses(studentId) {
    return await subjectRepository.getEnrolledCourses(studentId);
}

async function createSubject(name, professorId) {
    return await subjectRepository.createSubject(name, professorId);
}

async function insertFirstDescription(subjectId, descriptionText) {
    return await subjectRepository.insertFirstDescription(subjectId, descriptionText)
}

async function deleteSubject(subjectId) {
    return await subjectRepository.deleteSubject(subjectId)
}

async function getAvailableSubjects(studentId) {
    return await subjectRepository.getAvailableCourses(studentId)
}

async function enrollStudent(studentId, subjectId) {
    return await subjectRepository.enrollStudent(studentId, subjectId);
}

async function getEnrolledSubjectsBySearch(studentId, searchTerm) {
    return await subjectRepository.getEnrolledSubjectsBySearch(studentId, searchTerm)
}

async function getAvailableSubjectsBySearch(studentId, searchTerm) {
    return await subjectRepository.getAvailableSubjectsBySearch(studentId, searchTerm);
}

async function getDescription(subjectId) {
    return await subjectRepository.getDescription(subjectId);
}

async function getAnnouncements(subjectId) {
    return await subjectRepository.getAnnouncements(subjectId);
}

async function selectSubjectInStudent(subjectId, studentId) {
    return await subjectRepository.selectSubjectInStudent(subjectId, studentId);
}

async function getPdfFilePath(subjectId, typeOfPdf) {
    return await subjectRepository.getPdfFilePath(subjectId, typeOfPdf);
}

async function selectSubjectInProfessor(subjectId, professorId) {
    return await subjectRepository.selectSubjectInProfessor(subjectId, professorId);
}

async function getStudentsOfSubject(subjectId) {
    return await subjectRepository.getStudentsOfSubject(subjectId);
}

async function getNumberOfStudentsInSubject(subjectId) {
    return await subjectRepository.getNumberOfStudentsInSubject(subjectId);
}

async function updateDescription(subjectId, descriptionText) {
    return await subjectRepository.updateDescription(subjectId, descriptionText)
}

async function insertAnnouncement(subjectId, announcement) {
    return await subjectRepository.insertAnnouncement(subjectId, announcement);
}

async function deleteAnnouncement(announcementId) {
    return await subjectRepository.deleteAnnouncement(announcementId);
}

async function deletePdfFile(pdfId) {
    return await subjectRepository.deletePdfFile(pdfId);
}

async function savePdf(subjectId, filePath, filename, typeOfPdf) {
    return await subjectRepository.savePdf(subjectId, filePath, filename, typeOfPdf);
}


module.exports = {
    getProfessorSubjects,
    getEnrolledCourses,
    createSubject,
    insertFirstDescription,
    deleteSubject,
    getAvailableSubjects,
    enrollStudent,
    getEnrolledSubjectsBySearch,
    getAvailableSubjectsBySearch,
    getDescription,
    getAnnouncements,
    selectSubjectInStudent,
    selectSubjectInProfessor,
    getStudentsOfSubject,
    getNumberOfStudentsInSubject,
    updateDescription,
    insertAnnouncement,
    deleteAnnouncement,
    getPdfFilePath,
    deletePdfFile,
    savePdf
}