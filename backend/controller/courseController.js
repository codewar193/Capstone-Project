const { getFileFromBlobStorage } = require('../database/azureBlobStorage');
const Course = require('../models/course');
const Student = require('../models/student');

// Create a new course  
exports.createCourse = async (req, res) => {
  try {
    const { name, description,difficulty,trainer,trainerEmail} = req.body;

    console.log('Request Body:', req.body);

    const course = new Course({
      name,
      description,
      difficulty,
      trainer,
      trainerEmail
    });

    const createdCourse = await course.save();

    res.status(201).json(createdCourse);
  } catch (error) {
    console.error(error);
    res.status(500).send(req.body);
  }
};


// Get all courses  
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    // const files = getFileFromBlobStorage();
    // courses.thumbnail = files.thumbnail;
    // courses.video = files.video;

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve courses' });
  }
};

// Get a specific course by ID  
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve course' });
  }
};

// Update a course  
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete a course  
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};  

exports.enrollStudentInCourse= async (req, res) => {
  try{
    const {courseId,studentEmail}=req.body;
    const course = await Course.findById(courseId);
    if(!course)
    {
      return res.status(500).json({ error: 'Invalid Course' });
    }
    const student = await Student.findOne({email: studentEmail});
    if(!student){
      return res.status(500).json({ error: 'Invalid Student' });
    }
    course.enrolledStudents.push(student._id);
    student.coursesEnrolled.push(course._id);
    await student.save();
    await course.save();
    const email = course.trainerEmail; 
    // use azure logic app connection URL
    await fetch('',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        to:email,
        cc:"",
        subject:"Course Enrollment",
        body:`Student  ${student.fname + " " + student.lname} has been enrolled in your course`
      })
    })
    return res.status(200).json({"message":"Successfully Enrolled"});
  }catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to delete course' });
  }
};
exports.getEnrolledCourses=async(req,res)=>{
  try{
    const {email}=req.body;
    const studentCourse=await Student.aggregate([{
      $match:{
        email:email
      }
    },{
      $lookup:{
        from:'courses',
        localField:'coursesEnrolled',
        foreignField:'_id',
        as:'coursesEnroll'
      }
    }])
    //going home bye will do at night.
    return res.status(200).json(studentCourse);
  }catch(err){
    console.log(err);
    return res.status(500).json({ error: 'Failed to fetch course' });
  }
}

exports.derolledCourses=async(req,res)=>{
  try{
    const {email,courseId}=req.body;
    const student=await Student.findOne({email:email});
    student.coursesEnrolled = student.coursesEnrolled.filter((course)=>course.toString()===courseId);
    console.log(student.coursesEnrolled);
    await student.save();
    return res.status(200).json({message:"Successfully Derolled"});
  }catch(err){
    console.log(err);
    return res.status(500).json({ error: 'Failed to deroll course' });
  }
}
