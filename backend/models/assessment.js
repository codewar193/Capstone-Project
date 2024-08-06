const mongoose = require('mongoose');  
  
const assessmentSchema = new mongoose.Schema({  
  name: {  
    type: String,  
    required: true,  
  },  
  questions: {  
    type: [String],  
    required: true,  
  },  
});  
  
const Assessment = mongoose.model('Assessment', assessmentSchema);  
  
module.exports = Assessment;  
