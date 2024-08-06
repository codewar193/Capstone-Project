const express = require('express');  
const router = express.Router();  
const assessmentController = require('../controller/assessmentController');  
  
router.post('/', assessmentController.createAssessment);  
router.get('/', assessmentController.getAllAssessments);  
router.get('/:id', assessmentController.getAssessmentById);  
router.put('/:id', assessmentController.updateAssessment);  
router.delete('/:id', assessmentController.deleteAssessment);  
  
module.exports = router;  
