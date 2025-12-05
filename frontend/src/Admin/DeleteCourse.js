import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DeleteCourse = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await fetch("http://localhost:5284/api/Admin/all-courses");
      setCourses(await res.json());
    } catch {
      alert("Error loading courses");
    }
  };

  const deleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete course: ${course.courseName}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5284/api/Admin/delete-course/${course.courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken")
          }
        }
      );

      alert(await response.text());
      loadCourses();
    } catch {
      alert("Error deleting course");
    }
  };

  const updateCourse = (course) => {
    navigate(`/admin/update-course/${course.courseId}`);
  };

  const filteredCourses = courses.filter((c) =>
    c.courseName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="course">
      <h2>Delete/Update Courses</h2>


      <input
        className="input"
        placeholder="Search by course name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "300px", marginBottom: "20px" }}
      />

      <h2>Available Courses</h2>

      <div className="coursebox">
        <table className="coursetable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Capacity</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCourses.map((c) => (
              <tr key={c.courseId}>
                <td>{c.courseId}</td>
                <td>{c.courseName}</td>
                <td>{c.courseCapacity}</td>

                <td>
                  <button
                    onClick={() => updateCourse(c)}
                    style={{
                      background: "#2d6cdf",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    Update
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => deleteCourse(c)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default DeleteCourse;
