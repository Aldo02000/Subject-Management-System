const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller');
const controller = require('../controllers/controller');

router.get('/', userController.index);
router.get('/login', userController.login);
router.post('/login', userController.loginPost);
router.get('/adduser', userController.adduser);
router.get('/admin', userController.admin);
router.get('/logout', userController.logout);
router.post('/adduser', userController.adduserPost);
router.get('/edituser/:ID', userController.edituser);
router.post('/edituser/:ID', userController.edituserPost);
router.get('/:ID', userController.delete);
router.post('/admin', userController.find);
router.post('/addSection', userController.addSection);
router.get('/welcome/:Id', userController.welcome);
router.post('/welcome/:Id/createSubject', userController.createSubject);
router.post('/welcome/:Id/deleteSubject/:subjectId', userController.deleteSubject);
router.get('/student/:Id', userController.viewAllSubjects);
router.get('/subjects', controller.viewAllSubjects);
router.post('/enroll/:subjectId', userController.enrollStudent); // Changed to POST method
router.get('/welcome/:Id/search', userController.searchSubject);
router.get('/welcome/:Id/subject/:subjectId', userController.viewSubjectDetails);

module.exports = router;