const express = require('express');
const router = express.Router();
const userCont = require('../controllers/userController');
const authController = require('../controllers/authenticationController');
const indexController = require('../controllers/indexController');
const authMiddleware = require('../middleware/authenticationMiddleware');
const professorController = require('../controllers/professorController');
const studentController = require('../controllers/studentController');
const subjectController = require('../controllers/subjectController');

// USER ROUTES
router.get('/user', userCont.renderUserPage);

// LOGIN ROUTES
router.get('/', indexController.index)
router.use('/login', authMiddleware.checkAuthenticationSuccess)
router.all('/user*', authMiddleware.checkAuthentication)
router.get('/login', authController.login);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logout);

// ADMIN ROUTES
router.post('/findUser', userCont.searchUser);
router.get('/addUser', userCont.renderAddUser);
router.post('/addUser', userCont.addUser);
router.get('/edituser/:ID', userCont.renderEditUser);
router.post('/edituser/:ID', userCont.editUser);
router.get('/:ID', userCont.deleteUser);

// PROFESSOR ROUTES
router.post('/user/createSubject', professorController.createSubject);
router.post('/deleteSubject/:subjectId', professorController.deleteSubject);

//STUDENT ROUTES
router.get('/user/availableSubjects', studentController.getAvailableSubjects);
router.post('/enroll/:subjectId', studentController.enrollStudent);
router.post('/searchSubject', studentController.searchSubject);

//SUBJECT ROUTES
router.get('/subject/:subjectId', subjectController.viewSubjectDetails);
router.post('/subject/:subjectId/edit-description', subjectController.editSubjectDescription);
router.post('/subject/:subjectId/add-announcement', subjectController.addAnnouncement);
router.post('/subject/:subjectId/deleteAnnouncement/:announcementId', subjectController.deleteAnnouncement);
router.get('/availableSubjects', subjectController.getAvailableSubjects);
router.post('/subject/:subjectId/upload-lecture', subjectController.uploadLectures);
router.post('/subject/:subjectId/upload-labs', subjectController.uploadLabs);
router.post('/subject/:subjectId/delete-pdf/:pdfId', subjectController.deletePdf)

module.exports = router;