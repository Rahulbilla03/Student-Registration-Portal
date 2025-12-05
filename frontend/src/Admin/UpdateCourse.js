import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) {
      alert("Invalid course");
      navigate("/admin/delete-course");
      return;
    }
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const res = await fetch("http://localhost:5284/api/Admin/all-courses");
      const list = await res.json();

      const course = list.find((c) => c.courseId === Number(id));

      if (!course) {
        alert("Course not found");
        navigate("/admin/delete-course");
        return;
      }

      setCourseName(course.courseName);
      setCapacity(course.courseCapacity);
      setLoaded(true);

    } catch {
      alert("Error loading course");
    }
  };

  const updateCourse = async () => {
    if (!courseName || !capacity) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5284/api/Course/update-course/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("adminToken"),
          },
          body: JSON.stringify({
            courseName,
            courseCapacity: Number(capacity),
          }),
        }
      );

      const text = await response.text();
      alert(text);

      navigate("/admin/delete-course"); 

    } catch {
      alert("Error updating course");
    }
  };

  return (
    <div className="course">
      <h2>Update Course</h2>

      {loaded ? (
        <>
          <label>Enter New Course Name</label><br />
          <input
            className="input"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          /><br />

          <label>Enter New Capacity</label><br />
          <input
            className="input"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          /><br />

          <button className="coursesearch" onClick={updateCourse}>
            Update Course
          </button>
        </>
      ) : (
        <p>Error Occured</p>
      )}
    </div>
  );
};

export default UpdateCourse;
