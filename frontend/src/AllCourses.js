import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const AllCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchingCourses = async () => {
      try {
        const response = await fetch("http://localhost:5284/api/Admin/all-courses");
        const text = await response.text();

        try {
          setAllCourses(JSON.parse(text));
        } catch {
          alert(text);
          setAllCourses([]);
        }

      } catch (error) {
        alert(error.message);
      }
    };

    fetchingCourses();
  }, []);

  const filteredCourses = allCourses.filter(course =>
    course.courseName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="course">

      <div className="below-navbar-btn">
        <button 
          className="create-course-btn"
          onClick={() => navigate("/admin/create-course")}
        >
          Create Course
        </button>
      </div>

      <h2 style={{marginTop:"-30px"}}>All Courses</h2>

      <input
        className="input"
        placeholder="Search by course name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="coursebox">
        {filteredCourses.length > 0 ? (
          <table className="coursetable">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Capacity</th>
                <th>Remaining Seats</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((item) => (
                <tr
                  key={item.courseId}
                  className={item.remainingSeats === 0 ? "fullcourserow" : ""}
                >
                  <td>{item.courseId}</td>
                  <td>{item.courseName}</td>
                  <td>{item.courseCapacity}</td>
                  <td>{item.remainingSeats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No courses available</p>
        )}
      </div>

    </div>
  );
};

export default AllCourses;
