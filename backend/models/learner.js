const mongoose = require('mongoose');  
  
const learnerSchema = new mongoose.Schema({  
  firstName: {  
    type: String,  
    required: true,  
  },  
  lastName: {  
    type: String,  
    required: true,  
  },  
  email: {  
    type: String,  
    required: true,  
    unique: true,  
  },  
  password: {  
    type: String,  
    required: true,  
  },  
  coursesEnrolled: [{  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Course',  
  }],  
});  
  
const Learner = mongoose.model('Learner', learnerSchema);  
  
module.exports = Learner;  
