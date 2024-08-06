import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import './CoursePage.css';
function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [userData, setUserData] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null); // New state to track the selected video  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch courses from the backend API  
    const userDataString = localStorage.getItem('user');
    const userDataJson = JSON.parse(userDataString);
    setUserData(userDataJson);
    fetch('http://localhost:5000/courses')
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error(error));
  }, []);

  const handleAddCourse = () => {
    navigate('upload');
  };

  const handleThumbnailClick = (courseId) => {
    setSelectedVideo(courseId);
  };

  const openVideoPlayer = (courseId) => {
    navigate(`/course/video?courseId=${courseId}`);
  }

  const handleEnroll = async (courseId) => {
    const userEmail = JSON.parse(localStorage.getItem('user')).email;
    const res = await fetch('http://localhost:5000/courses/enrollment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentEmail: userEmail,
        courseId: courseId,
      }),
    })
    console.log(await res.json());
    // Find the selected course based on the courseId  
    const selectedCourse = courses.find((course) => course._id === courseId);
    // Get the existing cart data from local storage  
    const cartDataString = localStorage.getItem('cart');
    const cartDataJson = JSON.parse(cartDataString) || [];
    // Add the selected course to the cart data  
    const updatedCartData = [...cartDataJson, selectedCourse];
    // Store the updated cart data in local storage  
    localStorage.setItem('cart', JSON.stringify(updatedCartData));
    // Navigate to the "/cart" page  
    navigate('/cart');
  };

  const score = location.state?.score;
  console.log(score);
  const suggestedCourses = courses.filter((course) => {
    // Filter suggested courses based on the score obtained from the assessment page  
    if (score > 8 && course.difficulty === 'Advanced') {
      return true;
    } else if (score > 4 && score <= 8 && course.difficulty === 'Intermediate') {
      return true;
    } else if (score <= 4 && course.difficulty === 'Beginner') {
      return true;
    }
    return false;
  });

  return (
    <>
      <div className='h'>
        <h2>All Courses</h2>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }} >
        {console.log(userData)}
        {userData && userData.role === 'Trainer' && (
          <button className="card" onClick={handleAddCourse} style={{ width: '5.9rem', height: '2.7rem', backgroundColor: '#ffffff', color: '#000000', position: 'fixed', top: '20px', right: '20px', marginTop: '5rem' }}>

            Add course
          </button>

        )}
        {/* <h2>Suggested Courses</h2>   */}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {suggestedCourses.map((course) => (
            <div className="card" style={{ width: '18rem', margin: '20px' }} key={course._id}>
              <div className="card-body">
                <img src={`http://localhost:5000/courses/courseImage/${course._id}_thumbnail`} alt="image" onClick={() => handleThumbnailClick(course._id)} />
                {selectedVideo === course._id && (
                  <video src={`http://localhost:5000/courses/courseVideo/${course._id}_video`} controls style={{ width: '100%', height: 'auto' }} />
                )}
                <div className="card-body">
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text">{course.description}</p>
                  <p className="card-text">Difficulty: {course.difficulty}</p>
                  <p className="card-text">Trainer: {course.trainer}</p>
                </div>
                <a href={`http://localhost:5000/courses/courseVideo/${course._id}_video`} download className="card-link">Download Video</a>
                <button className="card-link" onClick={() => handleEnroll(course._id)} to="/cart">Enroll</button>
              </div>
            </div>
          ))}
        </div>



        {courses.map((course) => (
          <div className="card" style={{ width: '18rem', margin: '20px' }} key={course._id}>
            <div className="card-body">
              <img src={`http://localhost:5000/courses/courseImage/${course._id}_thumbnail`} alt="image" onClick={() => openVideoPlayer(course._id)} />
              {/* {selectedVideo === course._id && (
              <video src={`http://localhost:5000/courses/courseVideo/${course._id}_video`} controls style={{ width: '100%', height: 'auto' }} />
            )} */}
              <div className="card-body">
                <h5 className="card-title">{course.name}</h5>
                <p className="card-text">{course.description}</p>
                <p className="card-text">Difficulty:{course.difficulty}</p>
                <p className="card-text">Trainer: {course.trainer}</p>
              </div>
              <a href={`http://localhost:5000/courses/courseVideo/${course._id}_video`} download className="card-link">Download Video</a>
              <button className="card-link" onClick={() => handleEnroll(course._id)} to="/cart">Enroll</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CoursePage;  
