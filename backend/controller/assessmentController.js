const Assessment = require('../models/assessment');  
  
// Create a new assessment  
exports.createAssessment = async (req, res) => {  
  try {  
    const { name, questions } = req.body;  
  
    const assessment = new Assessment({  
      name,  
      questions,  
    });  
  
    const createdAssessment = await assessment.save();  
  
    res.status(201).json(createdAssessment);  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({ error: 'Failed to create assessment' });  
  }  
};  
  
// Get all assessments  
exports.getAllAssessments = async (req, res) => {  
  try {  
    const assessments = await Assessment.find();  
  
    res.json(assessments);  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({ error: 'Failed to retrieve assessments' });  
  }  
};  
  
// Get a specific assessment by ID  
exports.getAssessmentById = async (req, res) => {  
  try {  
    const { id } = req.params;  
  
    const assessment = await Assessment.findById(id);  
  
    if (!assessment) {  
      return res.status(404).json({ error: 'Assessment not found' });  
    }  
  
    res.json(assessment);  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({ error: 'Failed to retrieve assessment' });  
  }  
};  
  
// Update an assessment  
exports.updateAssessment = async (req, res) => {  
  try {  
    const { id } = req.params;  
    const { name, questions } = req.body;  
  
    const updatedAssessment = await Assessment.findByIdAndUpdate(  
      id,  
      { name, questions },  
      { new: true }  
    );  
  
    if (!updatedAssessment) {  
      return res.status(404).json({ error: 'Assessment not found' });  
    }  
  
    res.json(updatedAssessment);  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({ error: 'Failed to update assessment' });  
  }  
};  
  
// Delete an assessment  
exports.deleteAssessment = async (req, res) => {  
  try {  
    const { id } = req.params;  
  
    const deletedAssessment = await Assessment.findByIdAndDelete(id);  
  
    if (!deletedAssessment) {  
      return res.status(404).json({ error: 'Assessment not found' });  
    }  
  
    res.json({ message: 'Assessment deleted successfully' });  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({ error: 'Failed to delete assessment' });  
  }  
};  
