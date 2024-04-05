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
router.get('/subject/:subjectId', userController.viewSubjectDetails);
router.get('/', userController.viewSubjectDetails);
router.get('/student/:Id', userController.viewAllSubjects);
router.post('/enroll/:subjectId', userController.enrollSubject); // Changed to POST method

module.exports = router;