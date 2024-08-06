const multer = require('multer');  
  
const storage = multer.diskStorage({  
  destination: (req, file, cb) => {  
    // Specify the destination directory for uploaded files  
    cb(null, 'uploads/');  
  },  
  filename: (req, file, cb) => {  
    // Generate a unique filename for the uploaded file  
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);  
    cb(null, file.fieldname + '-' + uniqueSuffix);  
  },  
});  
  
const upload = multer({ storage });  
  
module.exports = upload;  
